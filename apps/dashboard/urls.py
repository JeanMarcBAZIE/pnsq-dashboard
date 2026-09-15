# apps/dashboard/urls.py

from django.urls import path
from .views import DashboardNationalView

urlpatterns = [
    path('national/', DashboardNationalView.as_view(), name='dashboard-national'),
]