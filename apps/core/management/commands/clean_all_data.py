# apps/core/management/commands/clean_all_data.py

from django.core.management.base import BaseCommand
from django.apps import apps as django_apps


class Command(BaseCommand):
    help = 'Supprime TOUTES les données (régions, stations, alertes, corrections)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirme la suppression sans demander',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(self.style.WARNING(
                'ATTENTION : Cette commande va SUPPRIMER TOUTES les données !'
            ))
            self.stdout.write(self.style.WARNING(
                'Pour confirmer, relancez avec : python manage.py clean_all_data --confirm'
            ))
            return

        self.stdout.write(self.style.WARNING('Suppression en cours...'))
        self.stdout.write('')

        # ============================================================
        # 1. Supprimer les corrections de données (dépend de Station)
        # ============================================================
        try:
            DataCorrection = django_apps.get_model('quality', 'DataCorrection')
            count = DataCorrection.objects.count()
            DataCorrection.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'  OK : {count} corrections supprimées'))
        except LookupError:
            self.stdout.write('  -> Modèle DataCorrection non trouvé (ignoré)')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  ATTENTION Corrections : {e}'))

        # ============================================================
        # 2. Supprimer les alertes (dépend de Station)
        # ============================================================
        try:
            Alert = django_apps.get_model('alerts', 'Alert')
            count = Alert.objects.count()
            Alert.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'  OK : {count} alertes supprimées'))
        except LookupError:
            self.stdout.write('  -> Modèle Alert non trouvé (ignoré)')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  ATTENTION Alertes : {e}'))

        # ============================================================
        # 3. Supprimer les observations (si le modèle existe)
        # ============================================================
        try:
            Observation = django_apps.get_model('observations', 'Observation')
            count = Observation.objects.count()
            Observation.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'  OK : {count} observations supprimées'))
        except LookupError:
            # Essayer avec le nom alternatif "Observations"
            try:
                Observations = django_apps.get_model('observations', 'Observations')
                count = Observations.objects.count()
                Observations.objects.all().delete()
                self.stdout.write(self.style.SUCCESS(f'  OK : {count} observations supprimées'))
            except LookupError:
                self.stdout.write('  -> Modèle Observation non trouvé (ignoré)')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  ATTENTION Observations : {e}'))

        # ============================================================
        # 4. Supprimer les QualityFlags (dépend de Station)
        # ============================================================
        try:
            QualityFlag = django_apps.get_model('quality', 'QualityFlag')
            count = QualityFlag.objects.count()
            QualityFlag.objects.all().delete()
            self.stdout.write(self.style.SUCCESS(f'  OK : {count} quality flags supprimés'))
        except LookupError:
            self.stdout.write('  -> Modèle QualityFlag non trouvé (ignoré)')
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'  ATTENTION QualityFlag : {e}'))

        # ============================================================
        # 5. Supprimer les stations
        # ============================================================
        Station = django_apps.get_model('stations', 'Station')
        count = Station.objects.count()
        Station.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'  OK : {count} stations supprimées'))

        # ============================================================
        # 6. Supprimer les régions
        # ============================================================
        Region = django_apps.get_model('core', 'Region')
        count = Region.objects.count()
        Region.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'  OK : {count} régions supprimées'))

        # ============================================================
        # 7. Résumé
        # ============================================================
        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(self.style.SUCCESS('  BASE DE DONNÉES NETTOYÉE AVEC SUCCÈS'))
        self.stdout.write(self.style.SUCCESS('=' * 50))
        self.stdout.write(f'  Régions  : {Region.objects.count()}')
        self.stdout.write(f'  Stations : {Station.objects.count()}')
        self.stdout.write(self.style.SUCCESS('=' * 50))