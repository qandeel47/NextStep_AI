from django.core.management import call_command
from django.test import TestCase

from careerfields.models import CareerField


class SeedFieldsCommandTests(TestCase):
    def test_seed_is_idempotent_and_includes_expanded_catalogue(self):
        call_command('seed_fields', verbosity=0)
        first_count = CareerField.objects.count()
        call_command('seed_fields', verbosity=0)

        self.assertEqual(first_count, 31)
        self.assertEqual(CareerField.objects.count(), first_count)
        self.assertTrue(CareerField.objects.filter(name='General Medicine').exists())
        self.assertTrue(CareerField.objects.filter(name='Artificial Intelligence (AI)').exists())
        self.assertTrue(CareerField.objects.filter(name='Cybersecurity').exists())
        self.assertTrue(CareerField.objects.filter(name='Law').exists())
        self.assertTrue(CareerField.objects.filter(name='Education').exists())
