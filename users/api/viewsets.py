from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
)


class UserRegistration(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @extend_schema(
        summary='Register a new user',
        description='Create a new account with username, email, password, and confirm password.',
        request=RegisterSerializer,
        responses={201: None},
    )
    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                'message': 'User registered successfully.',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class UserLogin(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @extend_schema(
        summary='Login user',
        description='Authenticate a user with email and password and return JWT tokens.',
        request=LoginSerializer,
        responses={200: None},
    )
    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        return Response(
            {
                'message': 'Login successful.',
                'access': data['access'],
                'refresh': data['refresh'],
            },
            status=status.HTTP_200_OK,
        )


class UserProfile(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary='Get current user profile')
    def list(self, request):
        user = request.user
        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            },
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        summary='Change password',
        description='Update the authenticated user password after verifying the current password.',
        request=ChangePasswordSerializer,
        responses={200: None},
    )
    def create(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK,
        )


class Logout(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @extend_schema(
        summary='Logout user',
        description='Invalidate the provided refresh token to log the user out.',
        request=LogoutSerializer,
        responses={200: None},
    )
    def create(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {'message': 'Logout successful.'},
            status=status.HTTP_200_OK,
        )
