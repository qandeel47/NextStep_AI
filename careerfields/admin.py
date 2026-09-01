from django.contrib import admin

from .models import CareerField


@admin.register(CareerField)
class CareerFieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'demand_label', 'duration')
    list_filter = ('category',)
    search_fields = ('name', 'category', 'short_desc')
