from django.conf import settings
from django.db import models


SUBJECT_MARK_FIELDS = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Accounting',
    'English',
    'Economics',
    'Statistics',
]


class UserProfile(models.Model):
    EDUCATION_LEVEL_CHOICES = [
        ('Matric', 'Matric'),
        ('O-Level', 'O-Level'),
        ('Intermediate', 'Intermediate'),
        ('A-Level', 'A-Level'),
    ]

    BACKGROUND_CHOICES = [
        ('Pre-Engineering', 'Pre-Engineering'),
        ('Pre-Medical', 'Pre-Medical'),
        ('ICS', 'ICS'),
        ('Commerce', 'Commerce'),
        ('Arts / Humanities', 'Arts / Humanities'),
        ('Other', 'Other'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    education_level = models.CharField(
        max_length=40,
        choices=EDUCATION_LEVEL_CHOICES,
        blank=True,
    )
    background = models.CharField(
        max_length=40,
        choices=BACKGROUND_CHOICES,
        blank=True,
    )
    # { "Mathematics": {"obtained": 75, "total": 100, "percent": 75.0}, ... }
    marks = models.JSONField(default=dict, blank=True)
    profile_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.email}'s profile"


class UserAssessment(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assessment',
    )
    answers = models.JSONField(default=dict, blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User Assessment'
        verbose_name_plural = 'User Assessments'

    def __str__(self):
        return f'Assessment for {self.user.email}'
