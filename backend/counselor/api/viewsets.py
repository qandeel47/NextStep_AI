import json

from django.conf import settings
from django.db import transaction
from django.db.models import Count
from django.http import StreamingHttpResponse
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import BaseRenderer, JSONRenderer
from rest_framework.response import Response

from counselor.api.serializers import (
    ConversationSerializer,
    MessageSerializer,
    SendMessageSerializer,
)
from counselor.models import Conversation, Message
from counselor.service import (
    CounselorConfigurationError,
    CounselorServiceError,
    generate_reply,
    stream_reply,
)
from counselor.throttles import CounselorMessageThrottle


class EventStreamRenderer(BaseRenderer):
    media_type = 'text/event-stream'
    format = 'txt'
    charset = 'utf-8'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.none()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [JSONRenderer, EventStreamRenderer]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return self.queryset
        return (
            Conversation.objects
            .filter(user=self.request.user)
            .annotate(message_count=Count('messages'))
            .order_by('-updated_at')
        )

    def get_throttles(self):
        if getattr(self, 'action', None) == 'messages' and self.request.method == 'POST':
            return [CounselorMessageThrottle()]
        return super().get_throttles()

    @extend_schema(
        tags=['AI Counselor'],
        summary='Create a counselor conversation',
        request=None,
        responses={201: ConversationSerializer},
    )
    def create(self, request, *args, **kwargs):
        conversation = Conversation.objects.create(user=request.user)
        conversation.message_count = 0
        return Response(
            ConversationSerializer(conversation).data,
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        methods=['GET'],
        tags=['AI Counselor'],
        summary='Get messages from a counselor conversation',
        responses={200: MessageSerializer(many=True)},
    )
    @extend_schema(
        methods=['POST'],
        tags=['AI Counselor'],
        summary='Send a message to the AI career counselor',
        request=SendMessageSerializer,
        responses={201: MessageSerializer},
    )
    @action(
        detail=True,
        methods=['get', 'post'],
    )
    def messages(self, request, pk=None):
        conversation = self.get_object()
        if request.method == 'GET':
            messages = conversation.messages.all()[:100]
            return Response(MessageSerializer(messages, many=True).data)

        wants_stream = (
            request.query_params.get('stream') == '1'
            or 'text/event-stream' in request.headers.get('Accept', '')
        )
        if wants_stream:
            return self._stream_message(request, conversation)

        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        text = serializer.validated_data['message']
        recent = list(conversation.messages.order_by('-created_at', '-id')[:12])
        recent.reverse()

        try:
            reply, model = generate_reply(request.user, recent, text)
        except CounselorConfigurationError as exc:
            return Response(
                {'detail': str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except CounselorServiceError as exc:
            return Response(
                {'detail': str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        with transaction.atomic():
            Message.objects.create(
                conversation=conversation,
                role=Message.USER,
                content=text,
            )
            assistant_message = Message.objects.create(
                conversation=conversation,
                role=Message.ASSISTANT,
                content=reply,
                model=model,
            )
            if conversation.title == 'New conversation':
                conversation.title = text[:117] + ('…' if len(text) > 117 else '')
            conversation.save(update_fields=['title', 'updated_at'])

        return Response(
            MessageSerializer(assistant_message).data,
            status=status.HTTP_201_CREATED,
        )

    def _stream_message(self, request, conversation):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        text = serializer.validated_data['message']
        recent = list(conversation.messages.order_by('-created_at', '-id')[:12])
        recent.reverse()

        def events():
            answer = []
            try:
                for kind, chunk in stream_reply(request.user, recent, text):
                    if kind == 'text':
                        answer.append(chunk)
                    yield f'data: {json.dumps({"type": kind, "text": chunk}, ensure_ascii=False)}\n\n'
            except CounselorConfigurationError as exc:
                yield f'data: {json.dumps({"type": "error", "detail": str(exc)})}\n\n'
                return
            except CounselorServiceError as exc:
                yield f'data: {json.dumps({"type": "error", "detail": str(exc)})}\n\n'
                return

            reply = ''.join(answer).strip()
            if not reply:
                yield (
                    'data: '
                    f'{json.dumps({"type": "error", "detail": "The counselor could not answer that request."})}\n\n'
                )
                return

            with transaction.atomic():
                Message.objects.create(
                    conversation=conversation,
                    role=Message.USER,
                    content=text,
                )
                assistant_message = Message.objects.create(
                    conversation=conversation,
                    role=Message.ASSISTANT,
                    content=reply,
                    model=settings.GEMINI_MODEL,
                )
                if conversation.title == 'New conversation':
                    conversation.title = text[:117] + ('…' if len(text) > 117 else '')
                conversation.save(update_fields=['title', 'updated_at'])

            yield (
                'data: '
                f'{json.dumps({"type": "done", "message": MessageSerializer(assistant_message).data}, ensure_ascii=False)}\n\n'
            )

        response = StreamingHttpResponse(events(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response
