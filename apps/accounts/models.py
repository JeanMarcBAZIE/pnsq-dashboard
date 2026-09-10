# apps/accounts/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """Modèle utilisateur étendu pour l'ANAM"""
    
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', _('Administrateur')
        MANAGER = 'MANAGER', _('Manager')
        TECHNICIAN = 'TECHNICIAN', _('Technicien')
        READER = 'READER', _('Lecteur')
        FORECASTER = 'FORECASTER', _('Prévisionniste')
        CLIMATOLOGIST = 'CLIMATOLOGIST', _('Climatologue')
    
    # Champs métier
    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.READER,
        verbose_name="Rôle"
    )
    region = models.ForeignKey(
        'core.Region',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Région"
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Numéro de téléphone"
    )
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    
    # Champs d'audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # ============================================================
    # AJOUT : Redéfinition de groups et user_permissions 
    # avec related_name personnalisés pour éviter les conflits
    # ============================================================
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='accounts_user_set',  # ← AJOUTÉ
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='accounts_user_set',  # ← AJOUTÉ
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    class Meta:
        db_table = 'accounts_users'
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role == self.Roles.ADMIN
    
    @property
    def is_manager(self):
        return self.role in [self.Roles.ADMIN, self.Roles.MANAGER]
    
    @property
    def is_technician(self):
        return self.role in [self.Roles.ADMIN, self.Roles.MANAGER, self.Roles.TECHNICIAN]
    
    def has_permission(self, permission_type, station=None):
        """
        Vérifie si l'utilisateur a une permission spécifique
        Permission types: 'view', 'edit', 'delete', 'admin'
        """
        if self.role == self.Roles.ADMIN:
            return True
        if self.role == self.Roles.READER:
            return permission_type == 'view'
        if self.role == self.Roles.TECHNICIAN:
            # Un technicien ne peut voir que sa région
            if station and station.region_id != self.region_id:
                return False
            return permission_type in ['view', 'edit']
        if self.role in [self.Roles.MANAGER, self.Roles.FORECASTER, self.Roles.CLIMATOLOGIST]:
            return permission_type in ['view', 'edit']
        return False