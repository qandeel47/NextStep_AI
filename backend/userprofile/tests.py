from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class UserProfileApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='profile-user',
            email='profile@example.com',
            password='StrongPass123!',
        )
        self.client.force_authenticate(self.user)

    def test_empty_profile_has_stable_response_shape(self):
        response = self.client.get(reverse('academic-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                'level': '',
                'background': '',
                'marks': {},
                'profile_completed': False,
                'updated_at': None,
            },
        )

    def test_profile_update_validates_and_calculates_completion(self):
        response = self.client.put(
            reverse('academic-profile'),
            {
                'level': 'Intermediate',
                'background': 'ICS',
                'marks': {
                    'Mathematics': {'obtained': 85, 'total': 100},
                    'Computer Science': {'obtained': 90, 'total': 100},
                },
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['profile_completed'])
        self.assertEqual(response.data['marks']['Mathematics']['percent'], 85.0)