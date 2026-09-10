from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Station
from .serializers import StationSerializer, StationCreateSerializer
from .services.stations_service import StationService
from apps.api.permissions import IsAdminUser, IsManagerOrAdmin, IsTechnicianOrAbove  # <-- Importer les permissions

class StationViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des stations.
    """
    queryset = Station.objects.select_related('region').all()
    
    def get_permissions(self):
        """Attribue des permissions différentes selon l'action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Seul l'admin ou le manager peut créer/modifier/supprimer une station
            permission_classes = [IsManagerOrAdmin]
        elif self.action in ['list', 'retrieve']:
            # Tout le monde peut voir les stations
            permission_classes = [IsTechnicianOrAbove]
        else:
            permission_classes = [IsTechnicianOrAbove]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'create':
            return StationCreateSerializer
        return StationSerializer

    def get_queryset(self):
        """Filtre les stations par région pour les techniciens."""
        user = self.request.user
        if user.role in [User.Role.ADMIN, User.Role.MANAGER]:
            return self.queryset
        elif user.region:
            return self.queryset.filter(region=user.region)
        return self.queryset.none()  # Les lecteurs n'ont pas accès à ce type de données en détail

    @action(detail=False, methods=['get'], permission_classes=[IsTechnicianOrAbove])
    def stats(self, request):
        """Endpoint pour les statistiques des stations (protégé)."""
        try:
            stats = StationService.get_station_stats()
            return Response(stats, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)