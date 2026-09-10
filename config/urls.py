# config/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Configuration de Swagger/OpenAPI
schema_view = get_schema_view(
    openapi.Info(
        title="PNSQ API - Plateforme Nationale de Suivi et de Qualité",
        default_version='v1',
        description="API de la plateforme de suivi des données météorologiques de l'ANAM",
        contact=openapi.Contact(email="support@anam.ma"),
        license=openapi.License(name="Propriétaire - ANAM"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API V1
    path('api/v1/', include('apps.api.urls')),
    path('api/v1/accounts/', include('apps.accounts.urls')),
    
    # Documentation API
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Servir les fichiers statiques et médias en développement
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)