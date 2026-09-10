# apps/alerts/serializers.py

from rest_framework import serializers
from .models import Alert
from apps.stations.models import Station
from apps.accounts.models import User


class AlertSerializer(serializers.ModelSerializer):
    """Sérialiseur principal pour les alertes"""
    
    # Champs personnalisés pour l'affichage
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    status_color = serializers.CharField(read_only=True)
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    
    # Informations sur la station
    station_name = serializers.CharField(source='station.name', read_only=True)
    station_code = serializers.CharField(source='station.code', read_only=True)
    station_status = serializers.CharField(source='station.status', read_only=True)
    station_region = serializers.CharField(source='station.region.name', read_only=True)
    
    # Informations sur l'utilisateur qui a acquitté
    acknowledged_by_username = serializers.CharField(
        source='acknowledged_by.username', 
        read_only=True, 
        default=None
    )
    acknowledged_by_fullname = serializers.SerializerMethodField()
    
    # Informations sur l'utilisateur qui a résolu
    resolved_by_username = serializers.CharField(
        source='resolved_by.username', 
        read_only=True, 
        default=None
    )
    resolved_by_fullname = serializers.SerializerMethodField()
    
    # Durées
    time_since_creation = serializers.SerializerMethodField()
    time_to_acknowledge = serializers.SerializerMethodField()
    time_to_resolve = serializers.SerializerMethodField()
    
    class Meta:
        model = Alert
        fields = [
            'id',
            'alert_id',
            'station',
            'station_name',
            'station_code',
            'station_status',
            'station_region',
            'alert_type',
            'alert_type_display',
            'status',
            'status_display',
            'status_color',
            'title',
            'description',
            'details',
            'created_at',
            'acknowledged_at',
            'acknowledged_by',
            'acknowledged_by_username',
            'acknowledged_by_fullname',
            'resolved_at',
            'resolved_by',
            'resolved_by_username',
            'resolved_by_fullname',
            'resolved_reason',
            'time_since_creation',
            'time_to_acknowledge',
            'time_to_resolve',
        ]
        read_only_fields = [
            'id', 
            'alert_id', 
            'created_at', 
            'acknowledged_at', 
            'resolved_at'
        ]
    
    def get_acknowledged_by_fullname(self, obj):
        """Retourne le nom complet de l'acquitteur"""
        if obj.acknowledged_by:
            return obj.acknowledged_by.get_full_name()
        return None
    
    def get_resolved_by_fullname(self, obj):
        """Retourne le nom complet du résolveur"""
        if obj.resolved_by:
            return obj.resolved_by.get_full_name()
        return None
    
    def get_time_since_creation(self, obj):
        """Temps écoulé depuis la création de l'alerte"""
        if obj.created_at:
            delta = obj.created_at - obj.created_at  # Calcul à faire dans le service
            # On retourne juste l'horodatage, le frontend calculera
            return obj.created_at.isoformat()
        return None
    
    def get_time_to_acknowledge(self, obj):
        """Temps entre la création et l'acquittement"""
        if obj.acknowledged_at and obj.created_at:
            delta = obj.acknowledged_at - obj.created_at
            return delta.total_seconds()
        return None
    
    def get_time_to_resolve(self, obj):
        """Temps entre l'acquittement et la résolution"""
        if obj.resolved_at and obj.acknowledged_at:
            delta = obj.resolved_at - obj.acknowledged_at
            return delta.total_seconds()
        return None


class AlertCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création d'une alerte"""
    
    class Meta:
        model = Alert
        fields = [
            'station',
            'alert_type',
            'title',
            'description',
            'details',
        ]
    
    def validate_station(self, value):
        """Vérifie que la station existe et est active"""
        if not value.is_active:
            raise serializers.ValidationError("Cette station est inactive.")
        return value
    
    def create(self, validated_data):
        """Crée une alerte avec un ID généré automatiquement"""
        from django.utils import timezone
        
        # Générer un ID d'alerte unique
        year = timezone.now().year
        count = Alert.objects.filter(
            created_at__year=year
        ).count() + 1
        
        validated_data['alert_id'] = f"ALT-{year}-{count:04d}"
        
        return super().create(validated_data)


class AlertUpdateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la mise à jour d'une alerte (statut uniquement)"""
    
    class Meta:
        model = Alert
        fields = [
            'status',
            'resolved_reason',
        ]
    
    def validate(self, attrs):
        """Validation du changement de statut"""
        status = attrs.get('status')
        instance = self.instance
        
        # Logique de transition de statut
        if status:
            if status == Alert.AlertStatus.RESOLVED:
                if instance.status in [Alert.AlertStatus.NEW, Alert.AlertStatus.ACKNOWLEDGED]:
                    if not attrs.get('resolved_reason'):
                        raise serializers.ValidationError({
                            'resolved_reason': 'La raison de la résolution est obligatoire.'
                        })
                else:
                    raise serializers.ValidationError({
                        'status': 'Seules les alertes nouvelles ou acquittées peuvent être résolues.'
                    })
            
            elif status == Alert.AlertStatus.ACKNOWLEDGED:
                if instance.status != Alert.AlertStatus.NEW:
                    raise serializers.ValidationError({
                        'status': 'Seules les alertes nouvelles peuvent être acquittées.'
                    })
        
        return attrs


class AlertStatsSerializer(serializers.Serializer):
    """Sérialiseur pour les statistiques des alertes"""
    
    total = serializers.IntegerField()
    new = serializers.IntegerField()
    acknowledged = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    resolved = serializers.IntegerField()
    ignored = serializers.IntegerField()
    
    alerts_by_type = serializers.DictField(child=serializers.IntegerField())
    alerts_by_station = serializers.DictField(child=serializers.IntegerField())


class AlertListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des alertes"""
    
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    status_color = serializers.CharField(read_only=True)
    station_name = serializers.CharField(source='station.name', read_only=True)
    station_code = serializers.CharField(source='station.code', read_only=True)
    
    class Meta:
        model = Alert
        fields = [
            'id',
            'alert_id',
            'station',
            'station_name',
            'station_code',
            'alert_type',
            'status',
            'status_display',
            'status_color',
            'title',
            'created_at',
            'acknowledged_at',
            'resolved_at',
        ]
        read_only_fields = fields


class AlertActionSerializer(serializers.Serializer):
    """Sérialiseur pour les actions sur les alertes (acquittement, résolution)"""
    
    reason = serializers.CharField(required=False, allow_blank=True)
    comment = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        """Validation personnalisée"""
        # Si une raison est fournie, on s'assure qu'elle n'est pas vide
        reason = attrs.get('reason', '').strip()
        if reason and len(reason) < 5:
            raise serializers.ValidationError({
                'reason': 'La raison doit contenir au moins 5 caractères.'
            })
        return attrs