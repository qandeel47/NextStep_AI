from django.db import transaction
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
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
        description='Return 10 compulsory questions. Multi-choice items require 2 or 3 options.',
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
    permission_classes = [IsAuthenticated]
    pagination_class = None


def _choice_error(question):
    if question.question_type == Question.SINGLE:
        return f'Question {question.order} requires exactly 1 choice.'
    return (
        f'Question {question.order} requires {question.min_select} to '
        f'{question.max_select} choices.'
    )


@extend_schema_view(
    list=extend_schema(
        tags=['Questionnaire'],
        summary='Get saved questionnaire answers',
        description='Return the logged-in student selected options and completion status.',
    ),
    create=extend_schema(
        tags=['Questionnaire'],
        summary='Submit questionnaire answers',
        description='All 10 questions are compulsory. Single = 1 choice, multiple = 2 or 3 choices.',
        request=SubmitAnswersSerializer,
    ),
)
class QuestionnaireAnswersViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SubmitAnswersSerializer

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
        questions = list(Question.objects.filter(is_active=True))
        by_id = {q.id: q for q in questions}

        if len(payload) != len(questions):
            return Response(
                {'detail': f'All {len(questions)} questions are compulsory. None can be skipped.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if set(item['question'] for item in payload) != set(by_id):
            return Response(
                {'detail': 'Answers must include every active question exactly once.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        created = []
        for item in payload:
            question = by_id[item['question']]
            option_ids = item['option_ids']
            count = len(option_ids)
            if count < question.min_select or count > question.max_select:
                return Response(
                    {'detail': _choice_error(question)},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            options = list(QuestionOption.objects.filter(
                id__in=option_ids,
                question=question,
            ))
            if len(options) != count:
                return Response(
                    {'detail': f'Invalid options for question {question.order}.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            for option in options:
                created.append(UserAnswer(user=request.user, question=question, option=option))

        with transaction.atomic():
            UserAnswer.objects.filter(user=request.user).delete()
            UserAnswer.objects.bulk_create(created)
            QuestionnaireSubmission.objects.update_or_create(
                user=request.user,
                defaults={'is_complete': True},
            )

        return Response({'message': 'Answers saved.', 'is_complete': True}, status=status.HTTP_201_CREATED)
