from django.conf import settings
from django.db import models


class Question(models.Model):
    SINGLE = 'single'
    MULTI = 'multi'
    TYPE_CHOICES = [
        (SINGLE, 'Single choice'),
        (MULTI, 'Multiple choice'),
    ]

    text = models.CharField(max_length=500)
    question_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=SINGLE)
    hint = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(unique=True)
    min_select = models.PositiveSmallIntegerField(default=1)
    max_select = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.order}. {self.text}'


class QuestionOption(models.Model):
    question = models.ForeignKey(Question, related_name='options', on_delete=models.CASCADE)
    label = models.CharField(max_length=500)
    tag = models.CharField(max_length=80, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['question', 'order', 'id']

    def __str__(self):
        return self.label


class UserAnswer(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='questionnaire_answers',
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='user_answers')
    option = models.ForeignKey(QuestionOption, on_delete=models.CASCADE, related_name='user_answers')

    class Meta:
        unique_together = ('user', 'question', 'option')

    def __str__(self):
        return f'{self.user} → {self.question_id}: {self.option_id}'


class QuestionnaireSubmission(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='questionnaire_submission',
    )
    is_complete = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user} questionnaire'
