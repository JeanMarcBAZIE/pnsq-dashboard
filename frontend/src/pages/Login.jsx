import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Si déjà connecté, rediriger vers le dashboard
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Effacer l'erreur en cas de nouvelle saisie
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await loginUser(formData.username, formData.password);
            if (response && response.access) {
                // Login réussi : stocker les infos via le contexte
                login(response.access, response.refresh, response.user);
                navigate('/');
            } else {
                setError('Identifiants invalides.');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.data) {
                setError(err.response.data.error || err.response.data.detail || 'Erreur de connexion.');
            } else {
                setError('Erreur réseau. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-anam-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-anam-blue">
                        PNSQ
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Plateforme Nationale de Suivi et de Qualité
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Connectez-vous à votre compte
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Nom d'utilisateur
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-anam-blue focus:border-anam-blue focus:z-10 sm:text-sm"
                                placeholder="Nom d'utilisateur"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-anam-blue focus:border-anam-blue focus:z-10 sm:text-sm"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-anam-danger bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-anam-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-anam-blue transition-colors ${
                                loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                        Vous n'avez pas de compte ? Contactez votre administrateur.
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;