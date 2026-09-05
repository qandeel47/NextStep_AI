from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from counselor.models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'model', 'created_at']
        read_only_fields = fields


class ConversationSerializer(serializers.ModelSerializer):
    message_count = serializers.IntegerField(read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id',
            'title',
            'message_count',
            'last_message',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

    @extend_schema_field(MessageSerializer(allow_null=True))
    def get_last_message(self, conversation):
        message = conversation.messages.order_by('-created_at', '-id').first()
        return MessageSerializer(message).data if message else None


class SendMessageSerializer(serializers.Serializer):
    message = serializers.CharField(
        max_length=2000,
        trim_whitespace=True,
        allow_blank=False,
    )

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError('Please enter a complete question.')
        return value
