# apps/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.stations.views import StationViewSet
from apps.accounts.views import UserViewSet
from apps.alerts.views import AlertViewSet

router = DefaultRouter()
router.register(r'stations', StationViewSet, basename='stations')
router.register(r'users', UserViewSet, basename='users')
router.register(r'alerts', AlertViewSet, basename='alerts')

urlpatterns = [
    path('', include(router.urls)),
]