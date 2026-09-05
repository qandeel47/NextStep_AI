from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationApiTests(APITestCase):
    def register(self):
        return self.client.post(
            reverse('register-list'),
            {
                'full_name': 'Test Student',
                'email': 'student@example.com',
                'password': 'StrongPass123!',
                'confirm_password': 'StrongPass123!',
            },
            format='json',
        )

    def test_register_login_profile_and_logout_flow(self):
        register_response = self.register()
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn('password', register_response.data['user'])

        login_response = self.client.post(
            reverse('login-list'),
            {'email': 'student@example.com', 'password': 'StrongPass123!'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        access = login_response.data['access']
        refresh = login_response.data['refresh']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')

        me_response = self.client.get(reverse('me-list'))
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data['email'], 'student@example.com')

        logout_response = self.client.post(
            reverse('logout-list'),
            {'refresh': refresh},
            format='json',
        )
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        refresh_response = self.client.post(
            reverse('token_refresh'),
            {'refresh': refresh},
            format='json',
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_duplicate_email_is_rejected_case_insensitively(self):
        self.assertEqual(self.register().status_code, status.HTTP_201_CREATED)
        response = self.client.post(
            reverse('register-list'),
            {
                'full_name': 'Another Student',
                'email': 'STUDENT@example.com',
                'password': 'StrongPass123!',
                'confirm_password': 'StrongPass123!',
            },
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)