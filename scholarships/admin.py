from django.contrib import admin

from .models import Scholarship


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'provider',
        'education_level',
        'province',
        'application_deadline',
        'collected_by',
        'date_collected',
    )
    list_filter = ('education_level', 'province', 'provider')
    search_fields = ('name', 'provider', 'eligibility', 'field_of_study')
