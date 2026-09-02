from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from universities.models import University
from .serializers import UniversitySerializer


@extend_schema_view(
    list=extend_schema(
        tags=['Universities'],
        summary='List universities',
        description='Return saved university records with admission and scholarship details.',
    ),
    retrieve=extend_schema(
        tags=['Universities'],
        summary='Get university details',
        description='Return one university by id, including programs, tests and contact info.',
    ),
)
class UniversityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None
