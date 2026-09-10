from rest_framework import viewsets, status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from .models import User
from .serializers import UserSerializer, UserCreateSerializer, LoginSerializer

User = get_user_model()

class LoginView(APIView):
    """
    Endpoint de connexion qui retourne un token JWT et les informations de l'utilisateur.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Identifiants invalides."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {"error": "Ce compte utilisateur est désactivé."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        # Sérialiser l'utilisateur pour la réponse
        user_serializer = UserSerializer(user)

        return Response({
            "access": access_token,
            "refresh": refresh_token,
            "user": user_serializer.data
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Endpoint de déconnexion qui blacklist le refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"detail": "Déconnexion réussie."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """
    Endpoint pour récupérer les informations de l'utilisateur connecté.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour la gestion des utilisateurs (CRUD).
    Réservé aux administrateurs.
    """
    queryset = User.objects.all().select_related('region')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def get_queryset(self):
        """Filtre les utilisateurs pour éviter que les techniciens voient tout."""
        user = self.request.user
        if user.role == User.Role.ADMIN or user.role == User.Role.MANAGER:
            return self.queryset
        elif user.role == User.Role.TECHNICIAN and user.region:
            return self.queryset.filter(region=user.region)
        else:
            # Un lecteur ne peut pas voir la liste des utilisateurs
            return self.queryset.none()