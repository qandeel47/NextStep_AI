from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from userprofile.models import AcademicProfile
from .serializers import AcademicProfileSerializer


@extend_schema_view(
    list=extend_schema(
        tags=['User Profile'],
        summary='Get academic profile and marks',
        description='Return the logged-in student education level, stream and subject percentages.',
    ),
    update=extend_schema(
        tags=['User Profile'],
        summary='Save academic profile and marks',
        description='Create or update education level, background/stream and marksheet values.',
        request=AcademicProfileSerializer,
    ),
)
class AcademicProfileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        profile = AcademicProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({'level': '', 'background': '', 'marks': {}})
        return Response(AcademicProfileSerializer(profile).data)

    def update(self, request, pk=None):
        profile, _ = AcademicProfile.objects.get_or_create(
            user=request.user,
            defaults={'level': '', 'background': '', 'marks': {}},
        )
        serializer = AcademicProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
