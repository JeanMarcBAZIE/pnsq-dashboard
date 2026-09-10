# apps/alerts/models.py

from django.db import models
from django.conf import settings

class Alert(models.Model):
    """Alerte générée par le système"""
    
    class AlertType(models.TextChoices):
        MISSING_DATA = 'A1', 'Absence de données'
        SENSOR_ANOMALY = 'A2', 'Anomalie capteur'
        BATTERY_LOW = 'A3', 'Batterie faible'
        QUALITY_ISSUE = 'A4', 'Problème de qualité'
    
    class AlertStatus(models.TextChoices):
        NEW = 'NEW', 'Nouvelle'
        ACKNOWLEDGED = 'ACK', 'Acquittée'
        IN_PROGRESS = 'INP', 'En cours'
        RESOLVED = 'RES', 'Résolue'
        IGNORED = 'IGN', 'Ignorée'
    
    # Identifiants
    alert_id = models.CharField(max_length=50, unique=True, verbose_name="ID Alerte")
    station = models.ForeignKey('stations.Station', on_delete=models.CASCADE, verbose_name="Station")
    
    # Type et statut
    alert_type = models.CharField(max_length=2, choices=AlertType.choices, verbose_name="Type")
    status = models.CharField(max_length=3, choices=AlertStatus.choices, default=AlertStatus.NEW, verbose_name="Statut")
    
    # Détails
    title = models.CharField(max_length=255, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    details = models.JSONField(default=dict, verbose_name="Détails")
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    acknowledged_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='acknowledged_alerts')
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    resolved_reason = models.TextField(blank=True)
    
    class Meta:
        db_table = 'alerts_alerts'
        verbose_name = "Alerte"
        verbose_name_plural = "Alertes"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.alert_id} - {self.station.name}"
    
    @property
    def status_color(self):
        colors = {
            'NEW': '#e53e3e',
            'ACK': '#dd6b20',
            'INP': '#3182ce',
            'RES': '#38a169',
            'IGN': '#a0aec0',
        }
        return colors.get(self.status, '#a0aec0')
