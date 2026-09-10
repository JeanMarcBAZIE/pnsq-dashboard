# apps/core/models.py

from django.db import models

class Region(models.Model):
    """Région géographique (ex: Nord, Sud, Centre)"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True, verbose_name="Nom de la région")
    code = models.CharField(max_length=10, unique=True, verbose_name="Code région")
    description = models.TextField(blank=True, verbose_name="Description")
    is_active = models.BooleanField(default=True, verbose_name="Active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_regions'
        verbose_name = "Région"
        verbose_name_plural = "Régions"
        ordering = ['name']

    def __str__(self):
        return f"{self.code} - {self.name}"

# apps/core/models.py (suite)

class Parameter(models.Model):
    """Paramètre météo (Température, Vent, Humidité, etc.)"""
    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=10, unique=True, verbose_name="Code")
    name = models.CharField(max_length=50, verbose_name="Nom")
    unit = models.CharField(max_length=20, verbose_name="Unité")
    symbol = models.CharField(max_length=10, verbose_name="Symbole")
    min_value = models.FloatField(null=True, blank=True, verbose_name="Valeur min")
    max_value = models.FloatField(null=True, blank=True, verbose_name="Valeur max")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_parameters'
        verbose_name = "Paramètre"
        verbose_name_plural = "Paramètres"
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name} ({self.unit})"