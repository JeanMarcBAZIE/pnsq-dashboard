# apps/core/management/commands/seed_data.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.core.models import Region, Parameter
from apps.stations.models import Station

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialise les données de base pour l\'application'
    
    def handle(self, *args, **options):
        self.stdout.write('Initialisation des données...')
        
        # 1. Créer les régions
        regions = [
            {'code': 'NORD', 'name': 'Région Nord'},
            {'code': 'SUD', 'name': 'Région Sud'},
            {'code': 'EST', 'name': 'Région Est'},
            {'code': 'OUEST', 'name': 'Région Ouest'},
            {'code': 'CENTRE', 'name': 'Région Centre'},
        ]
        for r in regions:
            region, created = Region.objects.get_or_create(code=r['code'], defaults={'name': r['name']})
            self.stdout.write(f"{'✓' if created else '•'} Région: {region.name}")
        
        # 2. Créer les paramètres météo
        params = [
            {'code': 'T', 'name': 'Température', 'unit': '°C', 'symbol': 'T', 'min_value': -50, 'max_value': 60},
            {'code': 'HR', 'name': 'Humidité Relative', 'unit': '%', 'symbol': 'HR', 'min_value': 0, 'max_value': 100},
            {'code': 'VV', 'name': 'Vitesse du Vent', 'unit': 'm/s', 'symbol': 'VV', 'min_value': 0, 'max_value': 80},
            {'code': 'DV', 'name': 'Direction du Vent', 'unit': '°', 'symbol': 'DV', 'min_value': 0, 'max_value': 360},
            {'code': 'PR', 'name': 'Pression', 'unit': 'hPa', 'symbol': 'PR', 'min_value': 850, 'max_value': 1100},
            {'code': 'RR', 'name': 'Précipitations', 'unit': 'mm', 'symbol': 'RR', 'min_value': 0, 'max_value': 500},
        ]
        for p in params:
            param, created = Parameter.objects.get_or_create(code=p['code'], defaults=p)
            self.stdout.write(f"{'✓' if created else '•'} Paramètre: {param.name}")
        
        # 3. Créer des stations de test
        if not Station.objects.exists():
            station_data = [
                {'id': 'STA_001', 'name': 'Station Aéroport Casa', 'code': 'CASA'},
                {'id': 'STA_002', 'name': 'Station Montagne Atlas', 'code': 'ATLAS'},
                {'id': 'STA_003', 'name': 'Station Sud Maroc', 'code': 'SUD'},
                {'id': 'STA_004', 'name': 'Station Est Maroc', 'code': 'EST'},
                {'id': 'STA_005', 'name': 'Station Ouest Maroc', 'code': 'OUEST'},
            ]
            for s in station_data:
                station, created = Station.objects.get_or_create(
                    id=s['id'],
                    defaults={
                        'name': s['name'],
                        'code': s['code'],
                        'region': Region.objects.first(),
                        'latitude': 30 + (hash(s['id']) % 10),
                        'longitude': -5 - (hash(s['id']) % 5),
                        'station_type': 'AWS',
                    }
                )
                self.stdout.write(f"{'✓' if created else '•'} Station: {station.name}")
        
        self.stdout.write(self.style.SUCCESS('✅ Initialisation terminée !'))