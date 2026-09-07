from django.test import SimpleTestCase
from django.urls import reverse


class HealthCheckTests(SimpleTestCase):
    def test_api_root_is_public(self):
        response = self.client.get(reverse('project-api-root'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], 'NextStep AI API')

    def test_health_check_is_public(self):
        response = self.client.get(reverse('health-check'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})
