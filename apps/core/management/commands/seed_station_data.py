# apps/core/management/commands/seed_station_data.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import random
from apps.stations.models import Station
from apps.observations.models import Observation
from apps.core.models import Parameter

class Command(BaseCommand):
    help = 'Génère des données de test pour les chroniques des stations'

    def add_arguments(self, parser):
        parser.add_argument(
            '--stations',
            type=int,
            default=5,
            help='Nombre de stations à peupler'
        )
        parser.add_argument(
            '--hours',
            type=int,
            default=48,
            help="Nombre d'heures de données à générer"
        )

    def handle(self, *args, **options):
        stations = Station.objects.all()[:options['stations']]
        hours = options['hours']

        self.stdout.write(f"Génération de {hours}h de données pour {len(stations)} stations...")

        for station in stations:
            # Déterminer l'intervalle selon le type
            interval_minutes = 10 if station.station_type == 'AWS' else 60
            total_points = (hours * 60) // interval_minutes

            # Créer quelques lacunes aléatoires
            gap_indices = random.sample(range(total_points), k=random.randint(2, 5))

            created_count = 0
            for i in range(total_points):
                # Sauter certains points pour créer des lacunes
                if i in gap_indices:
                    continue

                obs_date = timezone.now() - timedelta(minutes=(total_points - i) * interval_minutes)

                # Vérifier si l'observation existe déjà
                if Observation.objects.filter(station=station, observation_date=obs_date).exists():
                    continue

                # Générer des valeurs réalistes
                hour_of_day = obs_date.hour
                temp_base = 20 + 10 * random.random()
                temp_variation = 5 * random.random()

                Observation.objects.create(
                    station=station,
                    observation_date=obs_date,
                    temperature=round(temp_base + temp_variation, 1),
                    humidity=round(40 + 40 * random.random(), 1),
                    wind_speed=round(random.random() * 15, 1),
                    wind_direction=round(random.random() * 360, 0),
                    pressure_qff=round(1010 + 10 * random.random(), 1),
                    precipitation=round(random.random() * 5, 1) if random.random() > 0.7 else 0,
                    quality_flag=0 if random.random() > 0.05 else random.choice([1, 2]),
                )
                created_count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f"  ✓ {station.name}: {created_count} observations créées "
                    f"({len(gap_indices)} lacunes simulées)"
                )
            )

        self.stdout.write(self.style.SUCCESS("Génération terminée."))