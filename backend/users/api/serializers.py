import re

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


def user_public(user):
    name = (user.get_full_name() or '').strip() or user.username
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'name': name,
        'full_name': name,
    }


def tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)


def split_full_name(full_name):
    parts = (full_name or '').strip().split(None, 1)
    first = (parts[0] if parts else '')[:150]
    last = (parts[1] if len(parts) > 1 else '')[:150]
    return first, last


def unique_username(email, requested=''):
    requested = (requested or '').strip()
    if requested:
        return requested
    local = (email or '').split('@')[0].lower()
    base = re.sub(r'[^a-z0-9._]', '', local) or 'user'
    base = base[:140]
    username = base
    n = 1
    while User.objects.filter(username__iexact=username).exists():
        username = f'{base}{n}'
        n += 1
    return username


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    username = serializers.CharField(required=False, allow_blank=True, max_length=150)

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        try:
            validate_password(attrs['password'])
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)}) from exc

        email = attrs['email'].lower().strip()
        attrs['email'] = email
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({'email': 'This email is already registered.'})

        requested = (attrs.get('username') or '').strip()
        if requested and User.objects.filter(username__iexact=requested).exists():
            raise serializers.ValidationError({'username': 'This username is already taken.'})
        attrs['username'] = unique_username(email, requested)
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        full_name = validated_data.pop('full_name')
        first_name, last_name = split_full_name(full_name)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, allow_blank=False)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = User.objects.filter(email__iexact=email).first()

        if user is None or not user.is_active or not user.check_password(password):
            raise serializers.ValidationError('Invalid email or password.')

        access, refresh = tokens_for(user)
        attrs['user'] = user
        attrs['refresh'] = refresh
        attrs['access'] = access
        return attrs


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        try:
            token = RefreshToken(attrs['refresh'])
        except TokenError as exc:
            raise serializers.ValidationError({'refresh': 'Invalid or expired refresh token.'}) from exc

        request = self.context['request']
        if str(token.get('user_id')) != str(request.user.pk):
            raise serializers.ValidationError({'refresh': 'This token does not belong to the current user.'})
        attrs['token'] = token
        return attrs

    def save(self):
        self.validated_data['token'].blacklist()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    def validate(self, attrs):
        user = self.context['request'].user

        if not user.check_password(attrs.get('old_password')):
            raise serializers.ValidationError({'old_password': 'Old password is incorrect.'})

        if attrs.get('new_password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})

        if attrs.get('new_password') == attrs.get('old_password'):
            raise serializers.ValidationError({'new_password': 'New password must be different from the old password.'})

        try:
            validate_password(attrs['new_password'], user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'new_password': list(exc.messages)}) from exc

        return attrs

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
