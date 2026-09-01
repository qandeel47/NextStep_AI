from django.conf import settings
from django.db import models


class AcademicProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='academic_profile',
    )
    level = models.CharField(max_length=80)
    background = models.CharField(max_length=80)
    marks = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user} academic profile'
