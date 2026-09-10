# apps/stations/serializers.py

from rest_framework import serializers
from .models import Station
from apps.core.models import Region

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name', 'code']

class StationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les stations"""
    region_name = serializers.CharField(source='region.name', read_only=True)
    region_code = serializers.CharField(source='region.code', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    status_color = serializers.CharField(read_only=True)
    station_type_display = serializers.CharField(source='get_station_type_display', read_only=True)
    completeness = serializers.FloatField(read_only=True, default=100.0)  # Calculé par le service
    
    class Meta:
        model = Station
        fields = [
            'id', 'name', 'code', 'region', 'region_name', 'region_code',
            'latitude', 'longitude', 'altitude',
            'station_type', 'station_type_display',
            'status', 'status_display', 'status_color',
            'last_data_received', 'completeness',
            'is_active', 'maintenance_until', 'maintenance_reason',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class StationCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création de stations"""
    
    class Meta:
        model = Station
        fields = [
            'id', 'name', 'code', 'region',
            'latitude', 'longitude', 'altitude',
            'station_type', 'manufacturer', 'model', 'serial_number',
            'frequency', 'is_active'
        ]