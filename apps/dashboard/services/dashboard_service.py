# apps/dashboard/services/dashboard_service.py

import logging
from django.core.cache import cache
from apps.stations.services.stations_service import StationService
from apps.alerts.models import Alert

logger = logging.getLogger(__name__)

class DashboardService:
    """Service pour le tableau de bord national"""
    
    @classmethod
    def get_dashboard_data(cls):
        """Récupère toutes les données du dashboard"""
        cache_key = 'dashboard:data'
        data = cache.get(cache_key)
        
        if data is None:
            logger.info("Cache miss pour le dashboard")
            
            stats = StationService.get_national_stats()
            stations = StationService.get_station_map_data()
            
            # Top stations en panne
            down_stations = sorted(
                [s for s in stations if s['status'] == 'DOWN'],
                key=lambda x: x.get('last_data') or '',
                reverse=True
            )[:5]
            
            # Alertes actives
            active_alerts = Alert.objects.filter(status__in=['NEW', 'ACK']).count()
            alerts_by_type = Alert.objects.filter(status__in=['NEW', 'ACK']).values('alert_type').annotate(count=Count('id'))
            
            data = {
                'stats': stats,
                'down_stations': down_stations,
                'active_alerts': active_alerts,
                'alerts_by_type': list(alerts_by_type),
            }
            cache.set(cache_key, data, 60)
        
        return data