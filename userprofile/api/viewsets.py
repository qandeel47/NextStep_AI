from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from userprofile.models import UserProfile
from .serializers import UserProfileSerializer


@extend_schema_view(
    list=extend_schema(
        tags=['User Profile'],
        summary='Get education level, stream and subject marks',
        description='Return the logged-in student academic profile. Marks are entered per subject, not as a file.',
    ),
    update=extend_schema(
        tags=['User Profile'],
        summary='Save education level, stream and subject marks',
        description='Student types percentage for each subject (Math, Physics, Biology, etc.), same as the frontend form.',
        request=UserProfileSerializer,
    ),
)
class AcademicProfileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        profile = UserProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response({'level': '', 'background': '', 'marks': {}})
        return Response(UserProfileSerializer(profile).data)

    def update(self, request, pk=None):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
