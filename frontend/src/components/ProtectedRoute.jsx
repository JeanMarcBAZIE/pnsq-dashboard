import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    if (loading) {
        // Afficher un écran de chargement pendant la vérification
        return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
    }

    if (!isAuthenticated) {
        // Rediriger vers la page de connexion si non authentifié
        return <Navigate to="/login" replace />;
    }

    // Si des rôles sont spécifiés, vérifier que l'utilisateur a l'un d'eux
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user?.role)) {
            // Rediriger vers le dashboard si l'utilisateur n'a pas le bon rôle
            return <Navigate to="/" replace />;
        }
    }

    // Rendre les enfants (la page demandée)
    return <Outlet />;
};

export default ProtectedRoute;