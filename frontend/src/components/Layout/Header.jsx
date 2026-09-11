import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiBell, FiUser, FiMenu } from 'react-icons/fi';

const Header = ({ title, toggleSidebar }) => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 fixed top-0 right-0 left-0 z-30 md:left-64">
            <div className="h-full px-4 flex items-center justify-between">
                {/* Partie gauche : Bouton hamburger (mobile) + Titre */}
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <FiMenu className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-anam-blue">{title}</h1>
                </div>

                {/* Partie droite : Notifications + Profil */}
                <div className="flex items-center space-x-4">
                    {/* Bouton Notifications */}
                    <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
                        <FiBell className="h-6 w-6" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-anam-danger ring-2 ring-white"></span>
                    </button>

                    {/* Profil Utilisateur */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <FiUser className="h-8 w-8 text-anam-blue" />
                            <span className="hidden md:block text-sm font-medium text-gray-700">
                                {user?.username || 'Utilisateur'}
                            </span>
                            <span className="hidden md:block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {user?.role_display || user?.role || 'LECTEUR'}
                            </span>
                        </button>

                        {/* Menu déroulant */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                                <button
                                    onClick={() => setShowDropdown(false)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Mon profil
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-anam-danger hover:bg-gray-100"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;