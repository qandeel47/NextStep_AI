from django.contrib import admin

from .models import UserAssessment, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'education_level', 'background', 'profile_completed', 'updated_at')
    list_filter = ('education_level', 'background', 'profile_completed')
    search_fields = ('user__username', 'user__email')


@admin.register(UserAssessment)
class UserAssessmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_completed', 'updated_at')
    search_fields = ('user__username', 'user__email')
