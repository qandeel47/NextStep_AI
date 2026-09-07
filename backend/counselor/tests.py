from io import BytesIO
from unittest.mock import patch
from urllib.error import HTTPError

from django.contrib.auth import get_user_model
from django.test import SimpleTestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from counselor.models import Conversation, Message
from counselor import service as counselor_service
from counselor.service import (
    CounselorServiceError,
    detect_reply_language,
    extract_visible_reply,
    gemini_api_keys,
    generate_reply,
    recent_history,
)


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

    def test_extract_visible_reply_skips_thoughts_and_meta(self):
        data = {
            'candidates': [{
                'content': {
                    'parts': [
                        {'thought': True, 'text': 'internal plan'},
                        {'text': '/Acknowledge:* Hafsa, aap ke marks ache hain.\n- NUST\n- HEC scholarship'},
                    ],
                },
            }],
        }
        reply = extract_visible_reply(data)
        self.assertNotIn('internal plan', reply)
        self.assertNotIn('Acknowledge', reply)
        self.assertIn('NUST', reply)

    def test_detect_reply_language_follows_the_latest_message(self):
        english = detect_reply_language('Which universities match my marks?')
        roman = detect_reply_language('Mujhe relevant universities aur scholarships batao.')
        urdu = detect_reply_language('مجھے یونیورسٹی بتائیں')
        self.assertIn('English', english)
        self.assertIn('Roman Urdu', roman)
        self.assertIn('Urdu script', urdu)

    def test_recent_history_keeps_last_six_exchanges(self):
        class Item:
            def __init__(self, index):
                self.index = index

        items = [Item(i) for i in range(20)]
        sliced = recent_history(items, 6)
        self.assertEqual(len(sliced), 12)
        self.assertEqual(sliced[0].index, 8)
        self.assertEqual(sliced[-1].index, 19)


def _http_error(code, body=b'quota'):
    return HTTPError(
        'https://generativelanguage.googleapis.com/quota',
        code,
        'Error',
        hdrs=None,
        fp=BytesIO(body),
    )


def _quota_error(*_args, **_kwargs):
    raise _http_error(429)


class GeminiKeyRotationTests(SimpleTestCase):
    def setUp(self):
        counselor_service._active_key_index = 0

    @override_settings(
        GEMINI_API_KEY='key-a',
        GEMINI_API_KEYS=['key-a', 'key-b', '', 'key-b', 'key-c'],
        GEMINI_MODEL='gemini-3.6-flash',
    )
    def test_gemini_keys_keep_order_and_skip_duplicates(self):
        self.assertEqual(gemini_api_keys(), ['key-a', 'key-b', 'key-c'])

    @override_settings(
        GEMINI_API_KEYS=['key-1', 'key-2'],
        GEMINI_MODEL='gemini-3.6-flash',
    )
    @patch('counselor.service._build_payload', return_value={'generationConfig': {}})
    @patch('counselor.service._post_gemini')
    def test_generate_reply_uses_next_key_after_quota(self, mocked_post, _payload):
        mocked_post.side_effect = [
            _http_error(429),
            {
                'candidates': [{
                    'content': {'parts': [{'text': 'Check the listed universities.'}]},
                }],
            },
        ]

        reply, model = generate_reply(None, [], 'Which university?')

        self.assertEqual(reply, 'Check the listed universities.')
        self.assertEqual(model, 'gemini-3.6-flash')
        self.assertEqual(mocked_post.call_count, 2)
        self.assertEqual(mocked_post.call_args_list[0].args[2], 'key-1')
        self.assertEqual(mocked_post.call_args_list[1].args[2], 'key-2')
        self.assertEqual(counselor_service._active_key_index, 1)

    @override_settings(
        GEMINI_API_KEYS=['key-1', 'key-2'],
        GEMINI_MODEL='gemini-3.6-flash',
    )
    @patch('counselor.service._build_payload', return_value={'generationConfig': {}})
    @patch('counselor.service._post_gemini', side_effect=_quota_error)
    def test_generate_reply_errors_when_every_key_is_exhausted(self, _post, _payload):
        with self.assertRaises(CounselorServiceError) as caught:
            generate_reply(None, [], 'Which university?')
        self.assertIn('quota', str(caught.exception).lower())
