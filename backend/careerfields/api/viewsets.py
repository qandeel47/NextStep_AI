from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from careerfields.engine import score_field, user_tag_weights
from careerfields.models import CareerField
from questionnaire.models import QuestionnaireSubmission
from userprofile.models import UserProfile
from .serializers import CareerFieldSerializer


def serialize_scored(field, scores):
    data = CareerFieldSerializer(field).data
    data['scores'] = scores
    data['match'] = scores['final']
    data['reasons'] = scores.get('reasons') or []
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
    permission_classes = [IsAuthenticated]
    pagination_class = None


class RecommendationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CareerFieldSerializer

    @extend_schema(
        tags=['Career Fields'],
        summary='Get field recommendations for the logged-in student',
        description='Score each field from subject marks (40%), questionnaire tags (35%), education (15%) and market (10%).',
    )
    def list(self, request):
        profile = UserProfile.objects.filter(user=request.user).first()
        marks = profile.marks if profile else {}
        level = profile.education_level if profile else ''
        background = profile.background if profile else ''
        tags = user_tag_weights(request.user)
        submission = QuestionnaireSubmission.objects.filter(user=request.user).first()
        profile_ready = bool(profile and profile.profile_completed)
        quiz_ready = bool(submission and submission.is_complete)
        has_data = profile_ready and quiz_ready

        scored = []
        for field in CareerField.objects.all():
            scores = score_field(field, marks, tags, level, background)
            scored.append(serialize_scored(field, scores))
        scored.sort(key=lambda item: item['match'], reverse=True)

        return Response({
            'ready': has_data,
            'results': scored,
        })
