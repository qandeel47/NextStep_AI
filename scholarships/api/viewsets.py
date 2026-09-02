from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from scholarships.models import Scholarship
from .serializers import ScholarshipSerializer


@extend_schema_view(
    list=extend_schema(
        tags=['Scholarships'],
        summary='List government scholarships',
        description='Return scholarship records stored from the government schemes spreadsheet.',
    ),
    retrieve=extend_schema(
        tags=['Scholarships'],
        summary='Get scholarship details',
        description='Return one scholarship including eligibility, coverage, deadline and how to apply.',
    ),
)
class ScholarshipViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
