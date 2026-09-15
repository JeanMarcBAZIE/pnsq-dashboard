# apps/dashboard/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .services.dashboard_service import DashboardService


class DashboardNationalView(APIView):
    """
    Endpoint API qui retourne toutes les données du Tableau de Bord National.
    Accessible à tous les utilisateurs authentifiés.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            data = DashboardService.get_dashboard_data()
            return Response({
                'success': True,
                'data': data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# Create your views here.
