# apps/quality/models.py

from django.db import models
from django.conf import settings

class DataCorrection(models.Model):
    """Historique des corrections de données"""
    
    station = models.ForeignKey('stations.Station', on_delete=models.CASCADE, verbose_name="Station")
    observation_date = models.DateTimeField(verbose_name="Date d'observation")
    parameter = models.ForeignKey('core.Parameter', on_delete=models.PROTECT, verbose_name="Paramètre")
    
    original_value = models.FloatField(verbose_name="Valeur originale")
    corrected_value = models.FloatField(verbose_name="Valeur corrigée")
    
    correction_reason = models.CharField(max_length=100, verbose_name="Raison")
    comment = models.TextField(blank=True, verbose_name="Commentaire")
    
    corrected_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, verbose_name="Corrigé par")
    corrected_at = models.DateTimeField(auto_now_add=True, verbose_name="Corrigé le")
    
    class Meta:
        db_table = 'quality_datacorrections'
        verbose_name = "Correction de données"
        verbose_name_plural = "Corrections de données"
        unique_together = ['station', 'observation_date', 'parameter']
    
    def __str__(self):
        return f"{self.station.name} - {self.parameter.code} - {self.observation_date}"

class QualityFlag(models.Model):
    """Flag de qualité pour une observation"""
    
    class FlagType(models.IntegerChoices):
        GOOD = 0, 'Bonne qualité'
        SUSPECT = 1, 'Suspecte'
        ERROR = 2, 'Erronée'
        MISSING = 9, 'Manquante'
    
    station = models.ForeignKey('stations.Station', on_delete=models.CASCADE)
    observation_date = models.DateTimeField()
    parameter = models.ForeignKey('core.Parameter', on_delete=models.PROTECT)
    
    flag = models.IntegerField(choices=FlagType.choices, default=FlagType.GOOD)
    test_failed = models.CharField(max_length=100, blank=True, verbose_name="Test échoué")
    details = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'quality_flags'
        verbose_name = "Flag de qualité"
        verbose_name_plural = "Flags de qualité"
        unique_together = ['station', 'observation_date', 'parameter']
    
    def __str__(self):
        return f"{self.station.name} - {self.parameter.code} - Flag: {self.flag}"