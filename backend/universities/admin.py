from django.contrib import admin

from .models import University


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'sector', 'city', 'province', 'entry_tests', 'collected_by', 'date_collected')
    list_filter = ('sector', 'province', 'city')
    search_fields = ('name', 'city', 'programs', 'entry_tests')
