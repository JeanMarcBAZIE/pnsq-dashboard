# apps/stations/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StationViewSet
from .views_map import MapStationsView, StationDetailView

router = DefaultRouter()
router.register(r'stations', StationViewSet, basename='stations')

urlpatterns = [
    # Routes pour la carte interactive
    path('map/stations/', MapStationsView.as_view(), name='map-stations'),
    path('map/stations/<str:station_id>/', StationDetailView.as_view(), name='station-detail'),
    
    # Routes du ViewSet
    path('', include(router.urls)),
]