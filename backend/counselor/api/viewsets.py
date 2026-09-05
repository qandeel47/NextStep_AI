from django.db import transaction
from django.db.models import Count
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
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
)
from counselor.throttles import CounselorMessageThrottle


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.none()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
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
