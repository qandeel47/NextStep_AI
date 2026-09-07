from django.contrib import admin

from .models import University


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'sector', 'city', 'province', 'best_for', 'entry_tests', 'collected_by', 'date_collected')
    list_filter = ('sector', 'province', 'city', 'best_for')
    search_fields = ('name', 'city', 'programs', 'entry_tests', 'known_for', 'about')
    fieldsets = (
        (None, {
            'fields': ('name', 'website', 'sector', 'city', 'province', 'best_for'),
        }),
        ('Profile', {
            'fields': ('about', 'known_for', 'programs'),
        }),
        ('Admissions', {
            'fields': (
                'admission_criteria', 'entry_tests', 'merit_formula',
                'admission_intake', 'scholarships', 'contact',
            ),
        }),
        ('Meta', {
            'fields': ('source_url', 'collected_by', 'date_collected'),
        }),
    )
