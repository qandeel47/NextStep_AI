from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from questionnaire.models import (
    Question,
    QuestionOption,
    QuestionnaireSubmission,
    UserAnswer,
)
from .serializers import QuestionSerializer, SubmitAnswersSerializer


@extend_schema_view(
    list=extend_schema(
        tags=['Questionnaire'],
        summary='List all active questions',
        description='Return questionnaire questions with options and interest tags for matching.',
    ),
    retrieve=extend_schema(
        tags=['Questionnaire'],
        summary='Get one question',
        description='Return a single question and its answer options.',
    ),
)
class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.filter(is_active=True).prefetch_related('options')
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]
    pagination_class = None


@extend_schema_view(
    list=extend_schema(
        tags=['Questionnaire'],
        summary='Get saved questionnaire answers',
        description='Return the logged-in student selected options and completion status.',
    ),
    create=extend_schema(
        tags=['Questionnaire'],
        summary='Submit questionnaire answers',
        description='Save or replace answers. Used later with marks to recommend fields.',
        request=SubmitAnswersSerializer,
    ),
)
class QuestionnaireAnswersViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        rows = UserAnswer.objects.filter(user=request.user).select_related('question', 'option')
        grouped = {}
        for row in rows:
            grouped.setdefault(row.question_id, []).append({
                'id': row.option_id,
                'tag': row.option.tag,
                'label': row.option.label,
            })
        submission = QuestionnaireSubmission.objects.filter(user=request.user).first()
        return Response({
            'is_complete': bool(submission and submission.is_complete),
            'answers': [
                {'question': qid, 'options': options}
                for qid, options in grouped.items()
            ],
        })

    def create(self, request):
        serializer = SubmitAnswersSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data['answers']

        with transaction.atomic():
            UserAnswer.objects.filter(user=request.user).delete()
            created = []
            for item in payload:
                question = Question.objects.filter(id=item['question'], is_active=True).first()
                if not question:
                    return Response(
                        {'detail': f'Invalid question id {item["question"]}.'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                options = QuestionOption.objects.filter(
                    id__in=item['option_ids'],
                    question=question,
                )
                if options.count() != len(set(item['option_ids'])):
                    return Response(
                        {'detail': f'Invalid options for question {question.id}.'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                for option in options:
                    created.append(UserAnswer(user=request.user, question=question, option=option))
            UserAnswer.objects.bulk_create(created)
            QuestionnaireSubmission.objects.update_or_create(
                user=request.user,
                defaults={'is_complete': True},
            )

        return Response({'message': 'Answers saved.', 'is_complete': True}, status=status.HTTP_201_CREATED)
