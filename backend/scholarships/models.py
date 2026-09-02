from django.db import models


class Scholarship(models.Model):
    name = models.CharField(max_length=255, unique=True)
    provider = models.CharField(max_length=255)
    website = models.URLField(max_length=500, blank=True)
    education_level = models.CharField(max_length=80)
    province = models.CharField(max_length=120)
    field_of_study = models.TextField(blank=True)
    eligibility = models.TextField(blank=True)
    coverage = models.TextField(blank=True)
    required_documents = models.TextField(blank=True)
    application_deadline = models.CharField(max_length=255, blank=True)
    application_process = models.TextField(blank=True)
    contact = models.CharField(max_length=255, blank=True)
    source_url = models.URLField(max_length=500, blank=True)
    collected_by = models.CharField(max_length=150, blank=True)
    date_collected = models.DateField(null=True, blank=True)
    min_marks = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        help_text='Minimum percentage if the scheme states one; otherwise empty.',
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Scholarship'
        verbose_name_plural = 'Scholarships'

    def __str__(self):
        return self.name
