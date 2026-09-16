# apps/core/management/commands/seed_burkina.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.stations.models import Station
from apps.core.models import Region


class Command(BaseCommand):
    help = 'Initialise les 6 régions et 15 stations du Burkina Faso'

    def handle(self, *args, **options):
        self.stdout.write('Initialisation des données du Burkina Faso...')
        self.stdout.write('')

        # ============================================================
        # 1. CRÉATION DES 6 RÉGIONS DU BURKINA FASO
        # ============================================================
        regions_data = [
            {'code': 'BAN', 'name': 'Bankui',       'description': 'Chef-lieu : Bobo-Dioulasso'},
            {'code': 'DRI', 'name': 'Djôrô',        'description': 'Chef-lieu : Dori'},
            {'code': 'GOU', 'name': 'Guiriko',      'description': 'Chef-lieu : Gaoua'},
            {'code': 'KAD', 'name': 'Kadiogo',      'description': 'Chef-lieu : Ouagadougou'},
            {'code': 'KAY', 'name': 'Kaya',         'description': 'Chef-lieu : Kaya'},
            {'code': 'TEN', 'name': 'Tengkodogo',   'description': 'Chef-lieu : Tenkodogo'},
        ]

        self.stdout.write('--- Création des régions ---')
        regions = {}
        for region_data in regions_data:
            region, created = Region.objects.update_or_create(
                code=region_data['code'],
                defaults={
                    'name': region_data['name'],
                    'description': region_data.get('description', ''),
                    'is_active': True,
                }
            )
            regions[region_data['code']] = region
            status = '✓ créée' if created else '→ existante'
            self.stdout.write(f'  {status} : {region.code} - {region.name}')

        # ============================================================
        # 2. CRÉATION DES 15 STATIONS DU BURKINA FASO
        # ============================================================
        self.stdout.write('')
        self.stdout.write('--- Création des stations ---')

        stations_data = [
            # --- Région KADIOGO (Ouagadougou) ---
            {
                'station_id': 'BF_OUA',
                'name': 'Ouagadougou Aéroport',
                'code': 'WIGOS-BF-001',
                'region_code': 'KAD',
                'latitude': 12.3532,
                'longitude': -1.5124,
                'altitude': 316,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.25,  # 15 min
            },
            # --- Région BANKUI (Bobo-Dioulasso) ---
            {
                'station_id': 'BF_BOBO',
                'name': 'Bobo-Dioulasso',
                'code': 'WIGOS-BF-002',
                'region_code': 'BAN',
                'latitude': 11.1601,
                'longitude': -4.3310,
                'altitude': 460,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.5,
            },
            {
                'station_id': 'BF_DEDOUGOU',
                'name': 'Dédougou',
                'code': 'WIGOS-BF-007',
                'region_code': 'BAN',
                'latitude': 12.4667,
                'longitude': -3.4667,
                'altitude': 300,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 1,
            },
            {
                'station_id': 'BF_BOROMO',
                'name': 'Boromo',
                'code': 'WIGOS-BF-009',
                'region_code': 'BAN',
                'latitude': 11.7500,
                'longitude': -2.9333,
                'altitude': 271,
                'station_type': 'AWS',
                'status': 'WARNING',
                'hours_ago': 2.5,
            },
            {
                'station_id': 'BF_TOUGAN',
                'name': 'Tougan',
                'code': 'WIGOS-BF-014',
                'region_code': 'BAN',
                'latitude': 13.0667,
                'longitude': -3.0833,
                'altitude': 300,
                'station_type': 'AWS',
                'status': 'OK',
                'hours_ago': 0.75,
            },
            {
                'station_id': 'BF_BANFORA',
                'name': 'Banfora',
                'code': 'WIGOS-BF-015',
                'region_code': 'BAN',
                'latitude': 10.6333,
                'longitude': -4.7667,
                'altitude': 300,
                'station_type': 'AWS',
                'status': 'OK',
                'hours_ago': 0.33,
            },
            # --- Région DJÔRÔ (Dori) ---
            {
                'station_id': 'BF_DORI',
                'name': 'Dori',
                'code': 'WIGOS-BF-003',
                'region_code': 'DRI',
                'latitude': 14.0333,
                'longitude': -0.0333,
                'altitude': 276,
                'station_type': 'SYNOP',
                'status': 'DOWN',
                'hours_ago': 6,
            },
            {
                'station_id': 'BF_OUAHIGOUYA',
                'name': 'Ouahigouya',
                'code': 'WIGOS-BF-008',
                'region_code': 'DRI',
                'latitude': 13.5833,
                'longitude': -2.4167,
                'altitude': 336,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.5,
            },
            {
                'station_id': 'BF_DJIBO',
                'name': 'Djibo',
                'code': 'WIGOS-BF-012',
                'region_code': 'DRI',
                'latitude': 14.1000,
                'longitude': -1.6333,
                'altitude': 301,
                'station_type': 'AWS',
                'status': 'WARNING',
                'hours_ago': 1.75,
            },
            # --- Région TENKODOGO (Fada N'Gourma) ---
            {
                'station_id': 'BF_FADA',
                'name': "Fada N'Gourma",
                'code': 'WIGOS-BF-004',
                'region_code': 'TEN',
                'latitude': 12.0667,
                'longitude': 0.3500,
                'altitude': 309,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.4,
            },
            {
                'station_id': 'BF_BOGANDE',
                'name': 'Bogandé',
                'code': 'WIGOS-BF-011',
                'region_code': 'TEN',
                'latitude': 12.9833,
                'longitude': -0.1333,
                'altitude': 289,
                'station_type': 'AWS',
                'status': 'DOWN',
                'hours_ago': 12,
            },
            # --- Région GUIRIKO (Gaoua) ---
            {
                'station_id': 'BF_GAOUA',
                'name': 'Gaoua',
                'code': 'WIGOS-BF-005',
                'region_code': 'GOU',
                'latitude': 10.3333,
                'longitude': -3.1833,
                'altitude': 333,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.6,
            },
            {
                'station_id': 'BF_LEO',
                'name': 'Léo',
                'code': 'WIGOS-BF-013',
                'region_code': 'GOU',
                'latitude': 11.1000,
                'longitude': -2.1000,
                'altitude': 313,
                'station_type': 'AWS',
                'status': 'MAINTENANCE',
                'hours_ago': 48,
            },
            # --- Région KAYA ---
            {
                'station_id': 'BF_KAYA',
                'name': 'Kaya',
                'code': 'WIGOS-BF-006',
                'region_code': 'KAY',
                'latitude': 13.0833,
                'longitude': -1.0833,
                'altitude': 313,
                'station_type': 'SYNOP',
                'status': 'OK',
                'hours_ago': 0.3,
            },
            {
                'station_id': 'BF_PO',
                'name': 'Pô',
                'code': 'WIGOS-BF-010',
                'region_code': 'KAY',
                'latitude': 11.1667,
                'longitude': -1.1500,
                'altitude': 320,
                'station_type': 'AWS',
                'status': 'OK',
                'hours_ago': 0.9,
            },
        ]

        for data in stations_data:
            region_code = data.pop('region_code')
            hours_ago = data.pop('hours_ago')

            last_data_received = timezone.now() - timedelta(hours=hours_ago)

            defaults = {
                **data,
                'region': regions[region_code],
                'last_data_received': last_data_received,
                'is_active': True,
            }

            station, created = Station.objects.update_or_create(
                code=data['code'],
                defaults=defaults
            )

            status = '✓ créée' if created else '→ mise à jour'
            self.stdout.write(
                f'  {status} : {station.station_id} - {station.name} ({regions[region_code].name})'
            )

        # ============================================================
        # 3. RÉSUMÉ FINAL
        # ============================================================
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('  INITIALISATION BURKINA FASO TERMINÉE'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(f'  Régions  : {Region.objects.count()}')
        self.stdout.write(f'  Stations : {Station.objects.count()}')
        self.stdout.write('')

        # Afficher les stations par région
        self.stdout.write('  Répartition par région :')
        for code, region in regions.items():
            count = Station.objects.filter(region=region).count()
            self.stdout.write(f'    - {region.name:15s} : {count} station(s)')

        self.stdout.write(self.style.SUCCESS('=' * 60))