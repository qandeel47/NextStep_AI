from django.db import models


class University(models.Model):
    name = models.CharField(max_length=255, unique=True)
    website = models.URLField(max_length=500, blank=True)
    sector = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    programs = models.TextField(blank=True)
    admission_criteria = models.TextField(blank=True)
    entry_tests = models.CharField(max_length=255, blank=True)
    merit_formula = models.TextField(blank=True)
    admission_intake = models.CharField(max_length=255, blank=True)
    scholarships = models.TextField(blank=True)
    contact = models.CharField(max_length=255, blank=True)
    source_url = models.URLField(max_length=500, blank=True)
    collected_by = models.CharField(max_length=150, blank=True)
    date_collected = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'University'
        verbose_name_plural = 'Universities'

    def __str__(self):
        return self.name
