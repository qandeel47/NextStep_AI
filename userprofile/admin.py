from django.contrib import admin

from .models import AcademicProfile


@admin.register(AcademicProfile)
class AcademicProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'background', 'updated_at')
    search_fields = ('user__username', 'user__email', 'level', 'background')
