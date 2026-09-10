# apps/stations/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Station
from .serializers import StationSerializer, StationCreateSerializer
from .services.stations_service import StationService

class StationViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des stations"""
    queryset = Station.objects.select_related('region').all()
    permission_classes = []
    
    def get_serializer_class(self):
        if self.action == 'create':
            return StationCreateSerializer
        return StationSerializer
    
    def list(self, request, *args, **kwargs):
        """Récupère la liste des stations"""
        stations = StationService.get_station_map_data()
        return Response({
            'success': True,
            'count': len(stations),
            'results': stations
        })
    
    def retrieve(self, request, *args, **kwargs):
        """Récupère une station spécifique"""
        station = StationService.get_station_by_id(kwargs['pk'])
        if not station:
            return Response({'error': 'Station non trouvée'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(station)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Récupère les statistiques nationales"""
        stats = StationService.get_national_stats()
        return Response(stats)
