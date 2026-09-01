from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    EDUCATION_LEVEL_CHOICES = [
        ('intermediate', 'Intermediate'),
        ('matric', 'Matric'),
        ('o_level', 'O-Level'),
        ('a_level', 'A-Level'),
    ]

    # NOTE: single-choice group label. This is a deliberate MVP simplification —
    # it fits Intermediate students cleanly (they pick one group: pre-medical,
    # pre-engineering, etc.) but doesn't fully represent O/A-Level students, who
    # can combine subjects freely (e.g. Physics + Economics + Art). Revisit with
    # a proper subject-combination model (Subject + M2M) if O/A-Level accuracy
    # becomes important later.
    SUBJECT_CHOICES = [
        ('pre_medical', 'Pre-Medical'),
        ('pre_engineering', 'Pre-Engineering'),
        ('computer_science', 'Computer Science'),
        ('i_com', 'I.Com'),
        ('fa_arts', 'FA / Arts'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    education_level = models.CharField(
        max_length=30,
        choices=EDUCATION_LEVEL_CHOICES,
        default='intermediate',
    )
    subjects = models.CharField(
        max_length=30,
        choices=SUBJECT_CHOICES,
        default='computer_science',
    )
    
    marksheet = models.FileField(upload_to='marksheets/', blank=True, null=True)
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
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='assessment',) 

    # JSONField instead of question_1..question_11: adding, removing, or
    # reordering questions is a frontend-only change with this approach — no
    # migration needed. Expected shape:
    # {"question_1": "answer text", "question_2": "answer text", ...}
    answers = models.JSONField(default=dict, blank=True)

    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'User Assessment'
        verbose_name_plural = 'User Assessments'

    def __str__(self):
        return f"Assessment for {self.user.email}"
