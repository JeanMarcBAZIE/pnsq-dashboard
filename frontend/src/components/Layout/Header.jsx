import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiBell, FiUser, FiMenu, FiLogOut, FiSettings as FiSettingsIcon } from 'react-icons/fi';

const Header = ({ toggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Simulation d'utilisateur connecté
  const user = { first_name: 'Jean', last_name: 'Dupont', role: 'Technicien' };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      {/* Partie gauche : Menu burger + Titre */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden"
        >
          <FiMenu className="text-2xl" />
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800">
            <NavLink to="/dashboard">PNSQ</NavLink>
          </h1>
        </div>
      </div>

      {/* Partie droite : Notifications et Profil */}
      <div className="flex items-center space-x-4">
        {/* Sélecteur de fuseau horaire (simulé) */}
        <span className="text-sm text-gray-500 hidden sm:inline">UTC+1</span>

        {/* Bouton Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative"
          >
            <FiBell className="text-xl" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <span className="font-medium">Notifications</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-500 px-4 py-2">Aucune nouvelle notification</p>
              </div>
              <div className="px-4 py-2 border-t border-gray-100 text-center">
                <NavLink to="/alerts" className="text-sm text-blue-600 hover:underline">Voir toutes les alertes</NavLink>
              </div>
            </div>
          )}
        </div>

        {/* Menu Profil */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="sr-only">Ouvrir le menu utilisateur</span>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </div>
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <FiSettingsIcon className="mr-2" /> Paramètres
              </NavLink>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                <FiLogOut className="mr-2" /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;