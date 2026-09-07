from django.contrib import admin

from .models import CareerField


@admin.register(CareerField)
class CareerFieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'demand_label', 'duration')
    list_filter = ('category',)
    search_fields = ('name', 'category', 'short_desc', 'about')
    fieldsets = (
        (None, {
            'fields': ('name', 'category', 'duration', 'demand_label', 'market', 'future'),
        }),
        ('Summaries', {
            'fields': ('short_desc', 'about', 'market_outlook', 'future_outlook', 'field_value'),
        }),
        ('Lists', {
            'fields': (
                'required_subjects', 'preferred_levels', 'interest_tags', 'min_background',
                'learn', 'skills', 'careers', 'job_types', 'opportunities', 'risks', 'study_roadmap',
            ),
        }),
    )
