# apps/stations/views_station.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services.station_detail_service import StationDetailService
import logging

logger = logging.getLogger(__name__)

class StationDetailView(APIView):
    """
    Endpoint API pour récupérer les informations détaillées d'une station.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, station_id):
        try:
            data = StationDetailService.get_station_detail(station_id)
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erreur lors de la récupération de la station {station_id}: {e}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_404_NOT_FOUND)


class StationTimeseriesView(APIView):
    """
    Endpoint API pour récupérer les chroniques d'une station.
    Paramètres : ?hours=24 (par défaut)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, station_id):
        try:
            hours = int(request.query_params.get('hours', 24))
            data = StationDetailService.get_station_timeseries(station_id, hours)
            return Response({
                'success': True,
                'count': len(data),
                'data': data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des chroniques de {station_id}: {e}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StationGapsView(APIView):
    """
    Endpoint API pour récupérer les lacunes d'une station.
    Paramètres : ?hours=24 (par défaut)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, station_id):
        try:
            hours = int(request.query_params.get('hours', 24))
            data = StationDetailService.get_station_gaps(station_id, hours)
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erreur lors du calcul des lacunes de {station_id}: {e}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StationMetadataView(APIView):
    """
    Endpoint API pour récupérer les méta-données de transmission d'une station.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, station_id):
        try:
            data = StationDetailService.get_station_metadata(station_id)
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des métadonnées de {station_id}: {e}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)