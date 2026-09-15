# apps/stations/services/map_service.py

import logging
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from apps.stations.models import Station

logger = logging.getLogger(__name__)


class MapService:
    """
    Service pour la carte interactive.
    Gère la récupération des stations avec leur statut et leur position géographique.
    """

    CACHE_KEY_MAP_STATIONS = 'map:stations:all'
    CACHE_TIMEOUT = 60  # 60 secondes, conforme à la RG_1.3

    @classmethod
    def get_all_stations_for_map(cls):
        """
        Récupère toutes les stations actives avec leurs coordonnées et leur statut.
        """
        cache_key = cls.CACHE_KEY_MAP_STATIONS
        data = cache.get(cache_key)

        if data is None:
            logger.info("Cache miss pour les stations de la carte. Interrogation de la base...")

            stations = Station.objects.filter(
                is_active=True
            ).exclude(
                status=Station.StationStatus.INACTIVE
            ).values(
                # ⚠️ PAS de 'id' ici car la clé primaire est station_id
                'station_id',
                'name',
                'code',
                'latitude',
                'longitude',
                'altitude',
                'station_type',
                'status',
                'last_data_received',
            )

            data = []
            for station in stations:
                # Déterminer le statut réel (code couleur)
                status_code = cls._determine_status_code(station)

                data.append({
                    # ⚠️ Utiliser station_id comme identifiant
                    'station_id': station['station_id'],
                    'name': station['name'],
                    'code': station['code'],
                    'latitude': station['latitude'],
                    'longitude': station['longitude'],
                    'altitude': station['altitude'],
                    'station_type': station['station_type'],
                    'status': station['status'],
                    'status_code': status_code,
                    'last_data_received': (
                        station['last_data_received'].isoformat()
                        if station['last_data_received'] else None
                    ),
                    'color': cls._get_status_color(status_code),
                })

            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info(f"Cache mis à jour avec {len(data)} stations.")
        else:
            logger.debug("Cache hit pour les stations de la carte.")

        return data

    @classmethod
    def get_filtered_stations(cls, station_type=None, status=None, region_id=None):
        """
        Récupère les stations filtrées par type, statut ou région.
        """
        all_stations = cls.get_all_stations_for_map()
        filtered = all_stations

        if station_type and station_type != 'ALL':
            filtered = [s for s in filtered if s['station_type'] == station_type]

        if status and status != 'ALL':
            filtered = [s for s in filtered if s['status'] == status]

        if region_id:
            # Filtrer par région si nécessaire (nécessite d'ajouter region_id dans les données)
            filtered = [s for s in filtered if s.get('region_id') == region_id]

        return filtered

    @classmethod
    def get_station_details(cls, station_id):
        """
        Récupère les détails d'une station spécifique pour le popup.
        """
        try:
            station = Station.objects.select_related('region').get(station_id=station_id)

            # Simuler les 3 derniers paramètres clés (à remplacer plus tard par de vraies données)
            latest_data = {
                'temperature': 22.4,
                'wind_speed': 12,
                'pressure': 1012.5,
            }

            return {
                'station_id': station.station_id,
                'name': station.name,
                'code': station.code,
                'latitude': station.latitude,
                'longitude': station.longitude,
                'altitude': station.altitude,
                'station_type': station.station_type,
                'status': station.status,
                'status_code': cls._determine_status_code({
                    'status': station.status,
                    'last_data_received': station.last_data_received,
                }),
                'last_data_received': (
                    station.last_data_received.isoformat()
                    if station.last_data_received else None
                ),
                'latest_data': latest_data,
                'region_name': station.region.name if station.region else 'Non assignée',
                'is_active': station.is_active,
            }
        except Station.DoesNotExist:
            logger.error(f"Station {station_id} non trouvée.")
            return None

    @staticmethod
    def _determine_status_code(station):
        """
        Détermine le code de statut d'une station :
        - 0 : OK (Vert)
        - 1 : Retard (Orange)
        - 2 : Panne (Rouge)
        - 3 : Hors Service (Gris)
        """
        if station.get('status') in ('INACTIVE', 'MAINTENANCE'):
            return 3

        last_received = station.get('last_data_received')
        if last_received is None:
            return 2

        now = timezone.now()
        if isinstance(last_received, str):
            from django.utils.dateparse import parse_datetime
            last_received = parse_datetime(last_received)

        delta = now - last_received

        if delta < timedelta(hours=1):
            return 0  # OK
        elif delta < timedelta(hours=3):
            return 1  # Retard
        else:
            return 2  # Panne

    @staticmethod
    def _get_status_color(status_code):
        """Retourne la couleur hexadécimale selon le code de statut."""
        colors = {
            0: '#38a169',  # Vert Forêt
            1: '#dd6b20',  # Orange
            2: '#e53e3e',  # Rouge Sang
            3: '#a0aec0',  # Gris Moyen
        }
        return colors.get(status_code, '#a0aec0')