from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from careerfields.engine import score_field, user_interest_tags
from careerfields.models import CareerField
from questionnaire.models import QuestionnaireSubmission
from userprofile.models import AcademicProfile
from .serializers import CareerFieldSerializer


def serialize_scored(field, scores):
    data = CareerFieldSerializer(field).data
    data['scores'] = scores
    data['match'] = scores['final']
    return data


@extend_schema_view(
    list=extend_schema(
        tags=['Career Fields'],
        summary='List career fields',
        description='Return all career fields used for matching and browsing.',
    ),
    retrieve=extend_schema(
        tags=['Career Fields'],
        summary='Get one career field',
        description='Return details of a single field such as skills, careers and required subjects.',
    ),
)
class CareerFieldViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CareerField.objects.all()
    serializer_class = CareerFieldSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class RecommendationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['Career Fields'],
        summary='Get field recommendations for the logged-in student',
        description='Score each field from marksheet (40%), questionnaire tags (35%), education (15%) and market (10%).',
    )
    def list(self, request):
        profile = AcademicProfile.objects.filter(user=request.user).first()
        marks = profile.marks if profile else {}
        level = profile.level if profile else ''
        tags = user_interest_tags(request.user)
        submission = QuestionnaireSubmission.objects.filter(user=request.user).first()
        has_data = bool(marks) or bool(submission and submission.is_complete)

        scored = []
        for field in CareerField.objects.all():
            scores = score_field(field, marks, tags, level)
            scored.append(serialize_scored(field, scores))
        scored.sort(key=lambda item: item['match'], reverse=True)

        return Response({
            'ready': has_data,
            'results': scored,
        })
