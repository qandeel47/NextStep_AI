from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from counselor.models import Conversation, Message
from counselor.service import CounselorServiceError


class CounselorApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='counselor-user',
            email='counselor@example.com',
            password='StrongPass123!',
            first_name='Test',
        )
        self.client.force_authenticate(self.user)

    def create_conversation(self):
        response = self.client.post(
            reverse('counselor-conversation-list'),
            {},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response.data['id']

    @patch(
        'counselor.api.viewsets.generate_reply',
        return_value=('Software Engineering is a strong option.', 'test-model'),
    )
    def test_send_message_saves_user_and_assistant_messages(self, mocked_reply):
        conversation_id = self.create_conversation()
        response = self.client.post(
            reverse(
                'counselor-conversation-messages',
                args=[conversation_id],
            ),
            {'message': 'Which career suits me?'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['role'], Message.ASSISTANT)
        conversation = Conversation.objects.get(pk=conversation_id)
        self.assertEqual(conversation.messages.count(), 2)
        self.assertEqual(conversation.title, 'Which career suits me?')
        mocked_reply.assert_called_once()

    @patch(
        'counselor.api.viewsets.generate_reply',
        side_effect=CounselorServiceError('Service unavailable.'),
    )
    def test_provider_failure_does_not_save_partial_messages(self, _mocked_reply):
        conversation_id = self.create_conversation()
        response = self.client.post(
            reverse(
                'counselor-conversation-messages',
                args=[conversation_id],
            ),
            {'message': 'Please build a roadmap.'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertFalse(Message.objects.filter(conversation_id=conversation_id).exists())

    def test_user_cannot_access_another_users_conversation(self):
        other = get_user_model().objects.create_user(
            username='other-user',
            email='other@example.com',
            password='StrongPass123!',
        )
        conversation = Conversation.objects.create(user=other)

        response = self.client.get(
            reverse('counselor-conversation-detail', args=[conversation.id]),
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_authentication_is_required(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('counselor-conversation-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
