# apps/stations/admin.py

from django.contrib import admin
from .models import Station

@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'region', 'station_type', 'status', 'is_active']
    list_filter = ['station_type', 'status', 'region', 'is_active']
    search_fields = ['code', 'name']
    readonly_fields = ['created_at', 'updated_at']
