import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

// Création du contexte
export const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => useContext(AuthContext);

// Provider qui englobe l'application
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Fonction de login : stocke les tokens et l'utilisateur
    const login = (accessToken, refreshToken, userData) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Fonction de logout : supprime les tokens et l'utilisateur
    const logout = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        try {
            await logoutUser(refreshToken);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Vérifier l'état de l'utilisateur au chargement de l'app
    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem('access_token');
            const storedUser = localStorage.getItem('user');

            if (accessToken && storedUser) {
                try {
                    // Optionnel : récupérer les données fraîches de l'utilisateur
                    const userData = await getCurrentUser();
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (error) {
                    // Si le token est invalide, déconnecter
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Valeur du contexte à fournir
    const value = {
        user,
        setUser,
        loading,
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};