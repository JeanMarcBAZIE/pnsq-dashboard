# apps/stations/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StationViewSet
from .views_map import MapStationsView
from .views_station import (
    StationDetailView,
    StationTimeseriesView,
    StationGapsView,
    StationMetadataView,
)

router = DefaultRouter()
router.register(r'stations', StationViewSet, basename='stations')

urlpatterns = [
    # Routes pour la carte interactive
    path('map/stations/', MapStationsView.as_view(), name='map-stations'),

    # Routes pour la fiche station
    path('stations/<str:station_id>/', StationDetailView.as_view(), name='station-detail'),
    path('stations/<str:station_id>/timeseries/', StationTimeseriesView.as_view(), name='station-timeseries'),
    path('stations/<str:station_id>/gaps/', StationGapsView.as_view(), name='station-gaps'),
    path('stations/<str:station_id>/metadata/', StationMetadataView.as_view(), name='station-metadata'),

    # Routes du ViewSet
    path('', include(router.urls)),
]