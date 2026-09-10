from rest_framework import permissions
from apps.accounts.models import User

class IsAdminUser(permissions.BasePermission):
    """Permission pour les administrateurs uniquement."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == User.Role.ADMIN

class IsManagerOrAdmin(permissions.BasePermission):
    """Permission pour les managers et administrateurs."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in [User.Role.ADMIN, User.Role.MANAGER]

class IsTechnicianOrAbove(permissions.BasePermission):
    """Permission pour les techniciens, managers et administrateurs."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in [User.Role.ADMIN, User.Role.MANAGER, User.Role.TECHNICIAN]

class IsSameRegion(permissions.BasePermission):
    """Permission pour vérifier que l'utilisateur agit dans sa région."""
    def has_object_permission(self, request, view, obj):
        # L'utilisateur est Admin ou Manager (accès global)
        if request.user.role in [User.Role.ADMIN, User.Role.MANAGER]:
            return True
        # Le technicien ne peut agir que sur sa région
        if hasattr(obj, 'region'):
            return obj.region == request.user.region
        # Si l'objet n'a pas de région, autoriser par défaut (ou refuser selon le contexte)
        return False