from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
    tokens_for,
    user_public,
)


class UserRegistration(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Users'],
        summary='Register a new user',
        description='Create an account with full name, email and password. Returns JWT tokens and the user.',
        request=RegisterSerializer,
        responses={201: None},
    )
    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        access, refresh = tokens_for(user)
        return Response(
            {
                'message': 'User registered successfully.',
                'access': access,
                'refresh': refresh,
                'user': user_public(user),
            },
            status=status.HTTP_201_CREATED,
        )


class UserLogin(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @extend_schema(
        tags=['Users'],
        summary='Login user',
        description='Authenticate with email and password. Returns JWT tokens and the user.',
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
                'user': user_public(data['user']),
            },
            status=status.HTTP_200_OK,
        )


class UserProfile(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    @extend_schema(tags=['Users'], summary='Get current user profile')
    def list(self, request):
        return Response(user_public(request.user), status=status.HTTP_200_OK)

    @extend_schema(
        tags=['Users'],
        summary='Change password',
        description='Update the authenticated user password after verifying the current password.',
        request=ChangePasswordSerializer,
        responses={200: None},
    )
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK,
        )


class Logout(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['Users'],
        summary='Logout user',
        description='Invalidate the provided refresh token to log the user out.',
        request=LogoutSerializer,
        responses={200: None},
    )
    def create(self, request):
        serializer = LogoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'message': 'Logout successful.'},
            status=status.HTTP_200_OK,
        )
