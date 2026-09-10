# apps/core/admin.py

from django.contrib import admin
from .models import Region, Parameter

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'is_active']
    search_fields = ['name', 'code']
    list_filter = ['is_active']

@admin.register(Parameter)
class ParameterAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'unit', 'is_active']
    search_fields = ['name', 'code']