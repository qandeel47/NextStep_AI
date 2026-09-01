from django.contrib import admin

from .models import Question, QuestionOption, QuestionnaireSubmission, UserAnswer


class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 0


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('order', 'text', 'question_type', 'is_active')
    list_filter = ('question_type', 'is_active')
    inlines = [QuestionOptionInline]


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('user', 'question', 'option')
    list_filter = ('question',)


@admin.register(QuestionnaireSubmission)
class QuestionnaireSubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_complete', 'submitted_at')
