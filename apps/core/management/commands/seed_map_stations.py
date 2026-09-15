# apps/core/management/commands/seed_map_stations.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.stations.models import Station
from apps.core.models import Region


class Command(BaseCommand):
    help = 'Initialise des stations de test pour la carte interactive'

    def handle(self, *args, **options):
        self.stdout.write('Initialisation des stations pour la carte...')

        # ============ CRÉATION DES RÉGIONS ============
        regions_data = [
            {'code': 'NORD', 'name': 'Nord'},
            {'code': 'SUD', 'name': 'Sud'},
            {'code': 'EST', 'name': 'Est'},
            {'code': 'OUEST', 'name': 'Ouest'},
            {'code': 'CENTRE', 'name': 'Centre'},
        ]

        regions = {}
        for region_data in regions_data:
            region, created = Region.objects.update_or_create(
                code=region_data['code'],
                defaults={'name': region_data['name']}
            )
            regions[region_data['code']] = region
            if created:
                self.stdout.write(f'  ✓ Région créée : {region.name}')
            else:
                self.stdout.write(f'  → Région existante : {region.name}')

        # ============ CRÉATION DES STATIONS ============
        stations_data = [
            {
                'station_id': 'STA_CASA',
                'name': 'Station Casablanca Anfa',
                'code': 'WIGOS001',
                'region_code': 'CENTRE',
                'latitude': 33.5731,
                'longitude': -7.5898,
                'altitude': 27,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.25,  # 15 minutes
            },
            {
                'station_id': 'STA_RABAT',
                'name': 'Station Rabat Salé',
                'code': 'WIGOS002',
                'region_code': 'NORD',
                'latitude': 34.0209,
                'longitude': -6.8416,
                'altitude': 80,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.5,  # 30 minutes
            },
            {
                'station_id': 'STA_MARRAKECH',
                'name': 'Station Marrakech Ménara',
                'code': 'WIGOS003',
                'region_code': 'CENTRE',
                'latitude': 31.6295,
                'longitude': -7.9811,
                'altitude': 466,
                'station_type': 'SYNOP',
                'status': 'WARNING',
                'hours_ago': 2,  # 2 heures
            },
            {
                'station_id': 'STA_AGADIR',
                'name': 'Station Agadir Al Massira',
                'code': 'WIGOS004',
                'region_code': 'SUD',
                'latitude': 30.4202,
                'longitude': -9.5982,
                'altitude': 74,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.75,  # 45 minutes
            },
            {
                'station_id': 'STA_FES',
                'name': 'Station Fès Saïss',
                'code': 'WIGOS005',
                'region_code': 'EST',
                'latitude': 34.0331,
                'longitude': -5.0003,
                'altitude': 579,
                'station_type': 'SYNOP',
                'status': 'DOWN',
                'hours_ago': 5,  # 5 heures
            },
            {
                'station_id': 'STA_TANGER',
                'name': 'Station Tanger Ibn Battouta',
                'code': 'WIGOS006',
                'region_code': 'NORD',
                'latitude': 35.7595,
                'longitude': -5.8340,
                'altitude': 21,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.17,  # 10 minutes
            },
            {
                'station_id': 'STA_OUARZAZATE',
                'name': 'Station Ouarzazate',
                'code': 'WIGOS007',
                'region_code': 'SUD',
                'latitude': 30.9390,
                'longitude': -6.9070,
                'altitude': 1153,
                'station_type': 'AWS',
                'status': 'DOWN',
                'hours_ago': 48,  # 48 heures
            },
            {
                'station_id': 'STA_DAKHLA',
                'name': 'Station Dakhla',
                'code': 'WIGOS008',
                'region_code': 'SUD',
                'latitude': 23.6848,
                'longitude': -15.9580,
                'altitude': 12,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.33,  # 20 minutes
            },
            {
                'station_id': 'STA_ESSAOUIRA',
                'name': 'Station Essaouira Mogador',
                'code': 'WIGOS009',
                'region_code': 'OUEST',
                'latitude': 31.5085,
                'longitude': -9.7595,
                'altitude': 15,
                'station_type': 'AWS',
                'status': 'WARNING',
                'hours_ago': 1.5,  # 1h30
            },
            {
                'station_id': 'STA_AL_HOCEIMA',
                'name': 'Station Al Hoceima',
                'code': 'WIGOS010',
                'region_code': 'NORD',
                'latitude': 35.2528,
                'longitude': -3.9372,
                'altitude': 30,
                'station_type': 'AWS',
                'status': 'MAINTENANCE',
                'hours_ago': 48,  # 2 jours
            },
        ]

        for station_data in stations_data:
            # Extraire les données spécifiques
            region_code = station_data.pop('region_code')
            hours_ago = station_data.pop('hours_ago')
            
            # Calculer la date de dernière réception
            last_data_received = timezone.now() - timedelta(hours=hours_ago)
            
            # Préparer les defaults avec la région résolue
            defaults = {
                **station_data,
                'region': regions[region_code],
                'last_data_received': last_data_received,
                'is_active': True,
            }

            # Utiliser update_or_create avec le code (unique) comme critère
            station, created = Station.objects.update_or_create(
                code=station_data['code'],
                defaults=defaults
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'  ✓ Station créée : {station.name} ({station.station_id})')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'  → Station mise à jour : {station.name} ({station.station_id})')
                )

        # ============ RÉSUMÉ ============
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(self.style.SUCCESS(f'Initialisation terminée'))
        self.stdout.write(self.style.SUCCESS(f'  Régions : {Region.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'  Stations : {Station.objects.count()}'))
        self.stdout.write(self.style.SUCCESS('=' * 50))