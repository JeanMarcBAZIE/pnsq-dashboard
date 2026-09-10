# apps/stations/services/station_service.py

import logging
from datetime import timedelta
from django.utils import timezone
from django.core.cache import cache
from django.db.models import Count, Q, Avg, F
from apps.stations.models import Station
from apps.core.models import Parameter

logger = logging.getLogger(__name__)

class StationService:
    """Service pour la gestion des stations"""
    
    CACHE_KEY_STATIONS = 'stations:list'
    CACHE_KEY_STATS = 'stations:stats'
    CACHE_TIMEOUT = 60  # secondes
    
    @classmethod
    def get_all_stations(cls, refresh=False):
        """Récupère toutes les stations avec cache"""
        if refresh:
            cache.delete(cls.CACHE_KEY_STATIONS)
        
        data = cache.get(cls.CACHE_KEY_STATIONS)
        if data is None:
            logger.info("Cache miss pour les stations, requête DB...")
            stations = Station.objects.select_related('region').filter(is_active=True)
            data = list(stations.values(
                'id', 'name', 'code', 'region_id', 'region__name',
                'latitude', 'longitude', 'altitude',
                'station_type', 'status', 'last_data_received'
            ))
            cache.set(cls.CACHE_KEY_STATIONS, data, cls.CACHE_TIMEOUT)
            logger.info(f"{len(data)} stations mises en cache")
        
        return data
    
    @classmethod
    def get_station_map_data(cls):
        """Récupère les données formatées pour la carte interactive"""
        stations = cls.get_all_stations()
        map_data = []
        for s in stations:
            # Calcul du statut basé sur la dernière réception
            status = cls._calculate_status(s.get('last_data_received'))
            map_data.append({
                'id': s['id'],
                'name': s['name'],
                'latitude': s['latitude'],
                'longitude': s['longitude'],
                'status': status,
                'status_color': cls._get_status_color(status),
                'region': s['region__name'],
                'type': s['station_type'],
                'last_data': s['last_data_received'],
            })
        return map_data
    
    @classmethod
    def _calculate_status(cls, last_data_received):
        """Calcule le statut d'une station basé sur la dernière réception"""
        if last_data_received is None:
            return 'DOWN'
        
        delay = timezone.now() - last_data_received
        if delay <= timedelta(hours=1):
            return 'OK'
        elif delay <= timedelta(hours=3):
            return 'WARNING'
        else:
            return 'DOWN'
    
    @classmethod
    def _get_status_color(cls, status):
        """Retourne la couleur associée au statut"""
        colors = {
            'OK': '#38a169',
            'WARNING': '#dd6b20',
            'DOWN': '#e53e3e',
        }
        return colors.get(status, '#a0aec0')
    
    @classmethod
    def get_national_stats(cls):
        """Calcule les statistiques nationales"""
        cache_key = 'stations:national_stats'
        stats = cache.get(cache_key)
        
        if stats is None:
            total = Station.objects.filter(is_active=True).count()
            ok = Station.objects.filter(is_active=True, status='OK').count()
            warning = Station.objects.filter(is_active=True, status='WARNING').count()
            down = Station.objects.filter(is_active=True, status='DOWN').count()
            maintenance = Station.objects.filter(is_active=True, status='MAINTENANCE').count()
            
            # Calcul de la complétude moyenne (simulé pour l'instant)
            completeness = 94.2  # À remplacer par un calcul réel
            
            stats = {
                'total': total,
                'active': ok + warning,
                'ok': ok,
                'warning': warning,
                'down': down,
                'maintenance': maintenance,
                'completeness': completeness,
            }
            cache.set(cache_key, stats, 60)
        
        return stats
    
    @classmethod
    def get_station_by_id(cls, station_id):
        """Récupère une station par son ID"""
        try:
            return Station.objects.select_related('region').get(id=station_id)
        except Station.DoesNotExist:
            return None