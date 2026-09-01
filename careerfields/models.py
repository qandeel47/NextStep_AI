from django.db import models


class CareerField(models.Model):
    name = models.CharField(max_length=150, unique=True)
    category = models.CharField(max_length=80)
    required_subjects = models.JSONField(default=list, blank=True)
    preferred_levels = models.JSONField(default=list, blank=True)
    interest_tags = models.JSONField(default=list, blank=True)
    market = models.PositiveSmallIntegerField(default=5)
    future = models.PositiveSmallIntegerField(default=5)
    demand_label = models.CharField(max_length=80, blank=True)
    duration = models.CharField(max_length=50, blank=True)
    short_desc = models.TextField(blank=True)
    about = models.TextField(blank=True)
    learn = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    careers = models.JSONField(default=list, blank=True)
    min_background = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
