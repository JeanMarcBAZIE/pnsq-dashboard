# apps/observations/models.py

from django.db import models
from apps.stations.models import Station
from apps.core.models import Parameter


class Observation(models.Model):
    """
    Modèle représentant une observation météorologique.
    """
    station = models.ForeignKey(
        Station,
        on_delete=models.CASCADE,
        related_name='observations',
        verbose_name="Station"
    )
    observation_date = models.DateTimeField(
        verbose_name="Date d'observation",
        db_index=True
    )
    reception_date = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date de réception"
    )
    
    # Paramètres météorologiques
    temperature = models.FloatField(null=True, blank=True, verbose_name="Température (°C)")
    humidity = models.FloatField(null=True, blank=True, verbose_name="Humidité (%)")
    wind_speed = models.FloatField(null=True, blank=True, verbose_name="Vitesse du vent (m/s)")
    wind_direction = models.FloatField(null=True, blank=True, verbose_name="Direction du vent (°)")
    pressure_qff = models.FloatField(null=True, blank=True, verbose_name="Pression QFF (hPa)")
    precipitation = models.FloatField(null=True, blank=True, verbose_name="Précipitations (mm)")
    
    # Flag de qualité (0: OK, 1: Suspect, 2: Erroné, 9: Manquant)
    quality_flag = models.IntegerField(
        default=0,
        choices=[
            (0, 'Bonne qualité'),
            (1, 'Suspecte'),
            (2, 'Erronée'),
            (9, 'Manquante'),
        ],
        verbose_name="Flag de qualité"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'observations_observation'
        verbose_name = "Observation"
        verbose_name_plural = "Observations"
        ordering = ['-observation_date']
        indexes = [
            models.Index(fields=['station', 'observation_date']),
            models.Index(fields=['observation_date']),
        ]
        unique_together = [['station', 'observation_date']]

    def __str__(self):
        return f"{self.station.station_id} - {self.observation_date}"

    def get_quality_flag_display(self):
        """Retourne le libellé du flag de qualité."""
        return dict(self._meta.get_field('quality_flag').choices).get(self.quality_flag, 'Inconnu')
