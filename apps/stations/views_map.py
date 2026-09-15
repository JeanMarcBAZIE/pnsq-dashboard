# apps/stations/views_map.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .services.map_service import MapService
import logging

logger = logging.getLogger(__name__)


class MapStationsView(APIView):
    """
    Endpoint API pour récupérer les stations de la carte interactive.
    Accepte les filtres : type, status, region.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            station_type = request.query_params.get('type', 'ALL')
            status_filter = request.query_params.get('status', 'ALL')
            region_id = request.query_params.get('region', None)

            stations = MapService.get_filtered_stations(
                station_type=station_type,
                status=status_filter,
                region_id=region_id
            )

            return Response({
                'success': True,
                'count': len(stations),
                'stations': stations
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Erreur lors de la récupération des stations de la carte: {e}")
            return Response({
                'success': False,
                'error': 'Impossible de récupérer les stations.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StationDetailView(APIView):
    """
    Endpoint API pour récupérer les détails d'une station spécifique.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, station_id):
        try:
            station = MapService.get_station_details(station_id)
            
            if station is None:
                return Response({
                    'success': False,
                    'error': 'Station non trouvée.'
                }, status=status.HTTP_404_NOT_FOUND)

            return Response({
                'success': True,
                'station': station
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Erreur lors de la récupération de la station {station_id}: {e}")
            return Response({
                'success': False,
                'error': 'Impossible de récupérer les détails de la station.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)