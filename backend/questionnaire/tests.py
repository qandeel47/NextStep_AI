from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from questionnaire.models import Question, QuestionOption, UserAnswer


class QuestionnaireSubmissionTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='questionnaire-user',
            email='questionnaire@example.com',
            password='StrongPass123!',
        )
        self.client.force_authenticate(self.user)
        self.question_one = Question.objects.create(
            text='First question',
            question_type=Question.SINGLE,
            order=1,
            min_select=1,
            max_select=1,
        )
        self.question_two = Question.objects.create(
            text='Second question',
            question_type=Question.SINGLE,
            order=2,
            min_select=1,
            max_select=1,
        )
        self.option_one = QuestionOption.objects.create(
            question=self.question_one,
            label='First option',
        )
        self.option_two = QuestionOption.objects.create(
            question=self.question_two,
            label='Second option',
        )

    def test_invalid_submission_preserves_existing_answers(self):
        UserAnswer.objects.create(
            user=self.user,
            question=self.question_one,
            option=self.option_one,
        )

        response = self.client.post(
            reverse('questionnaire-answers'),
            {
                'answers': [
                    {
                        'question': self.question_one.id,
                        'option_ids': [self.option_one.id],
                    },
                    {
                        'question': self.question_two.id,
                        'option_ids': [self.option_one.id],
                    },
                ],
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(
            UserAnswer.objects.filter(
                user=self.user,
                question=self.question_one,
                option=self.option_one,
            ).exists()
        )

    def test_valid_submission_saves_every_answer(self):
        response = self.client.post(
            reverse('questionnaire-answers'),
            {
                'answers': [
                    {
                        'question': self.question_one.id,
                        'option_ids': [self.option_one.id],
                    },
                    {
                        'question': self.question_two.id,
                        'option_ids': [self.option_two.id],
                    },
                ],
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserAnswer.objects.filter(user=self.user).count(), 2)
        self.assertTrue(self.user.questionnaire_submission.is_complete)


class SeedQuestionsCommandTests(TestCase):
    def test_reseeding_preserves_existing_answers(self):
        call_command('seed_questions', verbosity=0)
        user = get_user_model().objects.create_user(
            username='seed-user',
            email='seed@example.com',
            password='StrongPass123!',
        )
        option = QuestionOption.objects.filter(question__order=1).first()
        answer = UserAnswer.objects.create(
            user=user,
            question=option.question,
            option=option,
        )

        call_command('seed_questions', verbosity=0)

        self.assertTrue(UserAnswer.objects.filter(pk=answer.pk).exists())
