# apps/dashboard/services/dashboard_service.py

import logging
from django.core.cache import cache
from django.utils import timezone
from django.db.models import Count, Q, Avg

from apps.stations.models import Station
from apps.alerts.models import Alert

logger = logging.getLogger(__name__)


class DashboardService:
    """
    Service d'agrégation des données pour le Tableau de Bord National.
    Utilise le cache Redis pour ne pas surcharger la base de données.
    """

    CACHE_KEY_NATIONAL_KPIS = 'dashboard:national:kpis'
    CACHE_KEY_TOP_STATIONS = 'dashboard:national:top_stations'
    CACHE_TIMEOUT = 60  # 60 secondes, conforme à la RG_1.3

    @classmethod
    def get_national_kpis(cls):
        """
        Calcule les 4 KPIs principaux affichés en haut du dashboard.
        """
        cache_key = cls.CACHE_KEY_NATIONAL_KPIS
        data = cache.get(cache_key)

        if data is None:
            logger.info("Cache miss pour les KPIs nationaux. Calcul en cours...")

            # --- KPI 1 : Complétude Nationale ---
            total_stations = Station.objects.filter(is_active=True).count()
            stations_ok = Station.objects.filter(
                is_active=True,
                status=Station.StationStatus.OK
            ).count()

            completeness = (stations_ok / total_stations * 100) if total_stations > 0 else 0

            # --- KPI 2 : Stations Actives ---
            active_stations = Station.objects.filter(is_active=True).count()

            # --- KPI 3 : Alertes Actives ---
            active_alerts = Alert.objects.filter(
                status__in=[Alert.AlertStatus.NEW, Alert.AlertStatus.ACKNOWLEDGED]
            ).count()

            # --- KPI 4 : Données Brutes (simulé pour la Phase 5) ---
            raw_data_count = 12450

            # --- Tendances (simulées pour la Phase 5) ---
            completeness_trend = +1.2
            stations_trend = -2
            alerts_trend = +2

            data = {
                'completeness': round(completeness, 1),
                'completeness_trend': completeness_trend,
                'active_stations': active_stations,
                'active_stations_trend': stations_trend,
                'active_alerts': active_alerts,
                'active_alerts_trend': alerts_trend,
                'raw_data_count': raw_data_count,
                'raw_data_trend': 0,
                'last_updated': timezone.now().isoformat(),
            }

            cache.set(cache_key, data, cls.CACHE_TIMEOUT)

        return data

    @classmethod
    def get_top_down_stations(cls, limit=5):
        """
        Retourne les N stations les plus critiques (en panne depuis le plus longtemps).
        Conforme à la RG_2.3 (tri par criticité).
        """
        cache_key = f"{cls.CACHE_KEY_TOP_STATIONS}:{limit}"
        data = cache.get(cache_key)

        if data is None:
            logger.info("Cache miss pour le Top Stations. Calcul en cours...")

            # On récupère les stations en panne, triées par date de dernière réception (la plus ancienne d'abord)
            down_stations = Station.objects.filter(
                is_active=True,
                status=Station.StationStatus.DOWN
            ).order_by('last_data_received')[:limit]

            data = []
            now = timezone.now()

            for station in down_stations:
                duration = "Inconnue"
                if station.last_data_received:
                    delta = now - station.last_data_received
                    hours = int(delta.total_seconds() // 3600)
                    if hours > 24:
                        duration = f"{hours // 24}j {hours % 24}h"
                    else:
                        duration = f"{hours}h"

                data.append({
                    'station_id': station.station_id,
                    'name': station.name,
                    'region': station.region.name if station.region else 'N/A',
                    'last_data_received': station.last_data_received.isoformat() if station.last_data_received else None,
                    'duration': duration,
                    'status': station.status,
                })

            cache.set(cache_key, data, cls.CACHE_TIMEOUT)

        return data

    @classmethod
    def get_dashboard_data(cls):
        """
        Point d'entrée unique qui retourne toutes les données du dashboard.
        """
        return {
            'kpis': cls.get_national_kpis(),
            'top_down_stations': cls.get_top_down_stations(limit=5),
        }