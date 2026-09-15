# apps/stations/models.py

from django.db import models
from apps.core.models import Region

class Station(models.Model):
    """Station météorologique"""
    
    class StationType(models.TextChoices):
        SYNOP = 'SYNOP', 'Synoptique'
        AWS = 'AWS', 'Automatique'
        CLIMAT = 'CLIMAT', 'Climatologique'
        RAIN = 'RAIN', 'Pluviométrique'
    
    class StationStatus(models.TextChoices):
        OK = 'OK', 'Opérationnelle'
        WARNING = 'WARNING', 'En alerte'
        DOWN = 'DOWN', 'En panne'
        MAINTENANCE = 'MAINTENANCE', 'En maintenance'
        INACTIVE = 'INACTIVE', 'Inactive'
    
    # Identifiants

    station_id = models.CharField(max_length=20, primary_key=True, verbose_name='Code_Clidata') # Important
    name = models.CharField(max_length=100, verbose_name="Nom")
    code = models.CharField(max_length=20, unique=True, verbose_name="Code_wigos")
    
    # Localisation
    region = models.ForeignKey(Region, on_delete=models.PROTECT, verbose_name="Région")
    latitude = models.FloatField(verbose_name="Latitude")
    longitude = models.FloatField(verbose_name="Longitude")
    altitude = models.FloatField(null=True, blank=True, verbose_name="Altitude (m)")
    
    # Caractéristiques
    station_type = models.CharField(max_length=10, choices=StationType.choices, default=StationType.AWS, verbose_name="Type")
    status = models.CharField(max_length=20, choices=StationStatus.choices, default=StationStatus.OK, verbose_name="Statut")
    
    # Métadonnées techniques
    manufacturer = models.CharField(max_length=50, blank=True, verbose_name="Fabricant")
    model = models.CharField(max_length=50, blank=True, verbose_name="Modèle")
    serial_number = models.CharField(max_length=50, blank=True, verbose_name="Numéro de série")
    
    # Paramètres de transmission
    frequency = models.IntegerField(default=10, verbose_name="Fréquence (minutes)")
    last_data_received = models.DateTimeField(null=True, blank=True, verbose_name="Dernière donnée reçue")
    
    # Gestion
    is_active = models.BooleanField(default=True, verbose_name="Active")
    maintenance_until = models.DateTimeField(null=True, blank=True, verbose_name="Maintenance jusqu'au")
    maintenance_reason = models.TextField(blank=True, verbose_name="Raison de la maintenance")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'stations_stations'
        verbose_name = "Station"
        verbose_name_plural = "Stations"
        ordering = ['name']
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @property
    def status_color(self):
        """Couleur associée au statut pour l'UI"""
        colors = {
            'OK': '#38a169',
            'WARNING': '#dd6b20',
            'DOWN': '#e53e3e',
            'MAINTENANCE': '#3182ce',
            'INACTIVE': '#a0aec0',
        }
        return colors.get(self.status, '#a0aec0')
    
    @property
    def is_down(self):
        return self.status in [self.StationStatus.DOWN, self.StationStatus.INACTIVE]