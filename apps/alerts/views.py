# apps/alerts/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Alert
from .serializers import AlertSerializer, AlertCreateSerializer
from apps.stations.services.stations_service import StationService

class AlertViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des alertes"""
    queryset = Alert.objects.select_related('station').all()
    permission_classes = []
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AlertCreateSerializer
        return AlertSerializer
    
    @action(detail=True, methods=['post'], url_path='acknowledge')
    def acknowledge(self, request, pk=None):
        """Acquitte une alerte"""
        alert = get_object_or_404(Alert, pk=pk)
        if alert.status in ['NEW']:
            alert.status = Alert.AlertStatus.ACKNOWLEDGED
            alert.acknowledged_at = timezone.now()
            alert.acknowledged_by = request.user if request.user.is_authenticated else None
            alert.save()
            return Response(AlertSerializer(alert).data)
        return Response({'error': 'L\'alerte ne peut pas être acquittée'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='resolve')
    def resolve(self, request, pk=None):
        """Résout une alerte"""
        alert = get_object_or_404(Alert, pk=pk)
        if alert.status in ['NEW', 'ACKNOWLEDGED']:
            alert.status = Alert.AlertStatus.RESOLVED
            alert.resolved_at = timezone.now()
            alert.resolved_by = request.user if request.user.is_authenticated else None
            alert.resolved_reason = request.data.get('reason', '')
            alert.save()
            return Response(AlertSerializer(alert).data)
        return Response({'error': 'L\'alerte ne peut pas être résolue'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='active')
    def active(self, request):
        """Récupère les alertes actives"""
        alerts = self.queryset.filter(status__in=['NEW', 'ACKNOWLEDGED'])
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)