from django.contrib import admin

from counselor.models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'updated_at')
    search_fields = ('title', 'user__email', 'user__username')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'role', 'model', 'created_at')
    list_filter = ('role', 'model')
    search_fields = ('content', 'conversation__user__email')
    readonly_fields = ('created_at',)
