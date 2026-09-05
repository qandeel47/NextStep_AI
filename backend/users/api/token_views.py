from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenRefreshView


class TaggedTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Users'],
        summary='Refresh JWT access token',
        description='Send a valid refresh token to get a new access token.',
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
