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

    station = models.ForeignKey(
        'stations.Station',
        on_delete=models.CASCADE,
        related_name='alerts',
        verbose_name="Station"
    )
    alert_type = models.CharField(max_length=2, choices=AlertType.choices, verbose_name="Type")
    status = models.CharField(max_length=3, choices=AlertStatus.choices, default=AlertStatus.NEW, verbose_name="Statut")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créée le")
    acknowledged_at = models.DateTimeField(null=True, blank=True, verbose_name="Acquittée le")
    acknowledged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Acquittée par"
    )
    resolved_at = models.DateTimeField(null=True, blank=True, verbose_name="Résolue le")
    details = models.JSONField(default=dict, blank=True, verbose_name="Détails")

    class Meta:
        db_table = 'alerts_alerts'
        verbose_name = "Alerte"
        verbose_name_plural = "Alertes"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.alert_type} - {self.station.name} ({self.status})"