# apps/stations/services/station_detail_service.py

import logging
from datetime import timedelta
from django.core.cache import cache
from django.utils import timezone
from django.db.models import Q
from apps.stations.models import Station
from apps.observations.models import Observation
from apps.quality.models import DataCorrection

logger = logging.getLogger(__name__)

class StationDetailService:
    """
    Service pour la fiche station détaillée.
    Gère la récupération des chroniques, des lacunes et des méta-données.
    Utilise le cache Redis pour optimiser les performances.
    """

    CACHE_KEY_STATION_DETAIL = 'station:detail:{station_id}'
    CACHE_KEY_STATION_TIMESERIES = 'station:timeseries:{station_id}:{hours}'
    CACHE_TIMEOUT = 60  # 60 secondes, conforme à la RG_1.3

    @classmethod
    def get_station_detail(cls, station_id):
        """
        Récupère les informations détaillées d'une station.
        """
        cache_key = cls.CACHE_KEY_STATION_DETAIL.format(station_id=station_id)
        data = cache.get(cache_key)

        if data is None:
            logger.info(f"Cache miss pour la station {station_id}. Interrogation BDD...")
            try:
                station = Station.objects.select_related('region').get(station_id=station_id)
                data = {
                    'station_id': station.station_id,
                    'name': station.name,
                    'code': station.code,
                    'region': station.region.name if station.region else None,
                    'region_id': station.region.id if station.region else None,
                    'latitude': station.latitude,
                    'longitude': station.longitude,
                    'altitude': station.altitude,
                    'station_type': station.station_type,
                    'status': station.status,
                    'status_display': station.get_status_display(),
                    'last_data_received': station.last_data_received.isoformat() if station.last_data_received else None,
                    'is_active': station.is_active,
                }
                cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            except Station.DoesNotExist:
                logger.error(f"Station {station_id} non trouvée.")
                raise Exception(f"Station {station_id} non trouvée.")
        else:
            logger.debug(f"Cache hit pour la station {station_id}.")

        return data

    @classmethod
    def get_station_timeseries(cls, station_id, hours=24):
        """
        Récupère les chroniques d'une station sur les dernières X heures.
        Retourne les données brutes avec les flags de qualité.
        """
        cache_key = cls.CACHE_KEY_STATION_TIMESERIES.format(station_id=station_id, hours=hours)
        data = cache.get(cache_key)

        if data is None:
            logger.info(f"Cache miss pour les chroniques de {station_id}. Interrogation BDD...")
            since = timezone.now() - timedelta(hours=hours)
            
            observations = Observation.objects.filter(
                station_id=station_id,
                observation_date__gte=since
            ).order_by('observation_date')

            # Récupérer les corrections pour cette station sur la période
            corrections = DataCorrection.objects.filter(
                station_id=station_id,
                observation_date__gte=since
            ).values('observation_date', 'parameter__code', 'corrected_value', 'correction_reason', 'corrected_by__username')

            # Indexer les corrections par (date, paramètre)
            corrections_map = {}
            for corr in corrections:
                key = (corr['observation_date'].isoformat(), corr['parameter__code'])
                corrections_map[key] = corr

            data = []
            for obs in observations:
                obs_dict = {
                    'observation_date': obs.observation_date.isoformat(),
                    'temperature': obs.temperature,
                    'humidity': obs.humidity,
                    'wind_speed': obs.wind_speed,
                    'wind_direction': obs.wind_direction,
                    'pressure_qff': obs.pressure_qff,
                    'precipitation': obs.precipitation,
                    'quality_flag': obs.quality_flag,
                    'quality_flag_display': obs.get_quality_flag_display(),
                }
                # Appliquer les corrections si elles existent
                for param in ['temperature', 'humidity', 'wind_speed', 'wind_direction', 'pressure_qff', 'precipitation']:
                    param_code = cls._get_parameter_code(param)
                    key = (obs.observation_date.isoformat(), param_code)
                    if key in corrections_map:
                        obs_dict[param] = corrections_map[key]['corrected_value']
                        obs_dict[f'{param}_corrected'] = True
                        obs_dict[f'{param}_correction_reason'] = corrections_map[key]['correction_reason']
                        obs_dict[f'{param}_corrected_by'] = corrections_map[key]['corrected_by__username']
                data.append(obs_dict)

            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
        else:
            logger.debug(f"Cache hit pour les chroniques de {station_id}.")

        return data

    @classmethod
    def get_station_gaps(cls, station_id, hours=24):
        """
        Calcule les lacunes (horodatages manquants) pour une station.
        Conforme à la RG_3.2 : identification des cycles manqués.
        """
        station = Station.objects.get(station_id=station_id)
        since = timezone.now() - timedelta(hours=hours)

        # Déterminer le pas de temps selon le type de station
        if station.station_type == 'AWS':
            interval_minutes = 10
        elif station.station_type == 'SYNOP':
            interval_minutes = 60
        else:
            interval_minutes = 60

        # Récupérer les observations existantes
        existing_dates = set(
            Observation.objects.filter(
                station_id=station_id,
                observation_date__gte=since
            ).values_list('observation_date', flat=True)
        )

        # Générer les horodatages attendus
        expected_dates = []
        current = since
        while current <= timezone.now():
            expected_dates.append(current)
            current += timedelta(minutes=interval_minutes)

        # Identifier les manquants
        gaps = []
        for expected in expected_dates:
            # Arrondir à la minute près pour la comparaison
            expected_rounded = expected.replace(second=0, microsecond=0)
            found = False
            for existing in existing_dates:
                if existing.replace(second=0, microsecond=0) == expected_rounded:
                    found = True
                    break
            if not found:
                gaps.append({
                    'expected_date': expected_rounded.isoformat(),
                    'duration_minutes': interval_minutes,
                })

        return {
            'station_id': station_id,
            'station_type': station.station_type,
            'interval_minutes': interval_minutes,
            'total_expected': len(expected_dates),
            'total_received': len(existing_dates),
            'total_missing': len(gaps),
            'completeness': round((len(existing_dates) / len(expected_dates)) * 100, 2) if expected_dates else 0,
            'gaps': gaps,
        }

    @classmethod
    def get_station_metadata(cls, station_id):
        """
        Récupère les méta-données de transmission.
        Conforme à la RG_3.3 : heure de réception vs heure de mesure.
        """
        station = Station.objects.get(station_id=station_id)
        
        # Récupérer les dernières observations avec les métadonnées de transmission
        observations = Observation.objects.filter(
            station_id=station_id
        ).order_by('-observation_date')[:10]

        metadata = []
        for obs in observations:
            metadata.append({
                'observation_date': obs.observation_date.isoformat(),
                'reception_date': obs.reception_date.isoformat() if hasattr(obs, 'reception_date') and obs.reception_date else None,
                'transmission_delay_seconds': (obs.reception_date - obs.observation_date).total_seconds() if hasattr(obs, 'reception_date') and obs.reception_date else None,
                'quality_flag': obs.quality_flag,
            })

        return {
            'station_id': station_id,
            'station_name': station.name,
            'metadata': metadata,
        }

    @staticmethod
    def _get_parameter_code(param_name):
        """Convertit le nom du paramètre en code."""
        mapping = {
            'temperature': 'T',
            'humidity': 'HR',
            'wind_speed': 'VV',
            'wind_direction': 'DV',
            'pressure_qff': 'PR',
            'precipitation': 'RR',
        }
        return mapping.get(param_name, param_name)