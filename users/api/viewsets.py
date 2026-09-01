from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
)


def user_payload(user):
    name = user.get_full_name().strip() or user.username
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'name': name,
    }


class AuthViewSet(viewsets.ViewSet):
    """User registration, login, logout, and password management endpoints."""

    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Users'],
        summary='Register a new student account',
        description='Create an account with name, email and password. Returns JWT tokens.',
        request=RegisterSerializer,
        responses={201: None},
    )
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'message': 'User registered successfully.',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': user_payload(user),
            },
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        tags=['Users'],
        summary='Login with email and password',
        description='Verify credentials and return access token, refresh token and user info.',
        request=LoginSerializer,
        responses={200: None},
    )
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = data['user']

        return Response(
            {
                'message': 'Login successful.',
                'access': data['access'],
                'refresh': data['refresh'],
                'user': user_payload(user),
            },
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        tags=['Users'],
        summary='Logout and blacklist refresh token',
        description='Invalidate the refresh token so it cannot be used again.',
        request=LogoutSerializer,
        responses={200: None},
    )
    @action(detail=False, methods=['post'], url_path='logout')
    def logout(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {'message': 'Logout successful.'},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        tags=['Users'],
        summary='Change the logged-in user password',
        description='Check the current password, then set a new password.',
        request=ChangePasswordSerializer,
        responses={200: None},
    )
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK,
        )
