# apps/core/services/core_service.py

import logging
from django.core.cache import cache
from django.db import models

logger = logging.getLogger(__name__)

class CoreService:
    """Service de base avec des méthodes utilitaires"""
    
    @staticmethod
    def get_or_create_default_region():
        """Récupère ou crée une région par défaut"""
        from apps.core.models import Region
        region, created = Region.objects.get_or_create(
            code='NATIONAL',
            defaults={
                'name': 'National',
                'description': 'Région nationale par défaut'
            }
        )
        return region
    
    @staticmethod
    def get_or_create_default_parameters():
        """Crée les paramètres météo par défaut"""
        from apps.core.models import Parameter
        params = [
            {'code': 'T', 'name': 'Température', 'unit': '°C', 'symbol': 'T', 'min_value': -50, 'max_value': 60},
            {'code': 'HR', 'name': 'Humidité Relative', 'unit': '%', 'symbol': 'HR', 'min_value': 0, 'max_value': 100},
            {'code': 'VV', 'name': 'Vitesse du Vent', 'unit': 'm/s', 'symbol': 'VV', 'min_value': 0, 'max_value': 80},
            {'code': 'DV', 'name': 'Direction du Vent', 'unit': '°', 'symbol': 'DV', 'min_value': 0, 'max_value': 360},
            {'code': 'PR', 'name': 'Pression', 'unit': 'hPa', 'symbol': 'PR', 'min_value': 850, 'max_value': 1100},
            {'code': 'RR', 'name': 'Précipitations', 'unit': 'mm', 'symbol': 'RR', 'min_value': 0, 'max_value': 500},
        ]
        created_params = []
        for p in params:
            obj, created = Parameter.objects.get_or_create(
                code=p['code'],
                defaults=p
            )
            created_params.append(obj)
        return created_params