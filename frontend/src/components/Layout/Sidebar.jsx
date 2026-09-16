// frontend/src/components/Layout/Sidebar.jsx

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiMap,
  FiBell,
  FiFileText,
  FiSettings,
  FiX,
  FiActivity,
  FiDatabase,
  FiUsers,
  FiSliders,
  FiBarChart2,
  FiDownload,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar, alertCount = 0 }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Récupérer le rôle de l'utilisateur (avec une valeur par défaut sécurisée)
  const userRole = user?.role || 'READER';

  // Vérifier si l'utilisateur a accès à une section
  const hasAccess = (allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(userRole);
  };

  // ============ DÉFINITION DES SECTIONS DU MENU ============
  // Conforme au Volume 2 du DCG (Plan du Site)
  const menuSections = [
    {
      id: 'supervision',
      label: 'SUPERVISION',
      roles: ['ADMIN', 'MANAGER', 'TECHNICIAN', 'READER', 'FORECASTER', 'CLIMATOLOGIST'],
      items: [
        {
          to: '/',
          icon: <FiHome />,
          label: 'Tableau de Bord',
          exact: true,
        },
        {
          to: '/map',
          icon: <FiMap />,
          label: 'Carte Interactive',
          exact: false,
        },
        {
          to: '/regional',
          icon: <FiActivity />,
          label: 'Vues Régionales',
          exact: false,
        },
      ],
    },
    {
      id: 'exploitation',
      label: 'EXPLOITATION',
      roles: ['ADMIN', 'MANAGER', 'TECHNICIAN', 'FORECASTER', 'CLIMATOLOGIST'],
      items: [
        {
          to: '/stations',
          icon: <FiDatabase />,
          label: 'Recherche Station',
          exact: false,
        },
        {
          to: '/quality',
          icon: <FiBarChart2 />,
          label: 'Qualité des Données',
          exact: false,
        },
        {
          to: '/alerts',
          icon: <FiBell />,
          label: 'Centre d\'Alertes',
          exact: false,
          badge: alertCount > 0 ? alertCount : null,
          badgeColor: 'bg-red-500',
        },
      ],
    },
    {
      id: 'analyse',
      label: 'ANALYSE',
      roles: ['ADMIN', 'MANAGER', 'CLIMATOLOGIST', 'FORECASTER'],
      items: [
        {
          to: '/reports',
          icon: <FiFileText />,
          label: 'Rapports Automatiques',
          exact: false,
        },
        {
          to: '/exports',
          icon: <FiDownload />,
          label: 'Export de Données',
          exact: false,
        },
      ],
    },
    {
      id: 'administration',
      label: 'ADMINISTRATION',
      roles: ['ADMIN', 'MANAGER'],
      items: [
        {
          to: '/admin/network',
          icon: <FiSliders />,
          label: 'Gestion du Réseau',
          exact: false,
        },
        {
          to: '/admin/users',
          icon: <FiUsers />,
          label: 'Rôles & Utilisateurs',
          exact: false,
        },
        {
          to: '/admin/settings',
          icon: <FiSettings />,
          label: 'Seuils & Config',
          exact: false,
        },
      ],
    },
  ];

  // Filtrer les sections selon le rôle de l'utilisateur
  const visibleSections = menuSections.filter((section) =>
    hasAccess(section.roles)
  );

  // Vérifier si un item est actif (gère les sous-routes)
  const isItemActive = (item) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    // Pour les routes dynamiques comme /stations/:id
    if (item.to === '/stations' && location.pathname.startsWith('/stations/')) {
      return true;
    }
    return location.pathname.startsWith(item.to) && item.to !== '/';
  };

  // ============ RENDU D'UN ITEM DE MENU ============
  const renderNavItem = (item) => {
    const active = isItemActive(item);

    return (
      <li key={item.to}>
        <NavLink
          to={item.to}
          end={item.exact}
          className={`
            flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200
            ${active
              ? 'bg-blue-700 text-white shadow-md'
              : 'text-gray-300 hover:bg-blue-800 hover:text-white'}
          `}
          onClick={() => {
            // Fermer la sidebar sur mobile après un clic
            if (window.innerWidth < 768 && toggleSidebar) {
              toggleSidebar();
            }
          }}
        >
          <span className="text-lg flex-shrink-0">{item.icon}</span>
          <span className="ml-3 truncate">{item.label}</span>
          {item.badge && (
            <span
              className={`ml-auto ${item.badgeColor || 'bg-red-500'} text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center`}
            >
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </NavLink>
      </li>
    );
  };

  // ============ RENDU D'UNE SECTION ============
  const renderSection = (section) => (
    <div key={section.id} className="mb-4">
      <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {section.label}
      </h3>
      <ul className="space-y-1">
        {section.items.map(renderNavItem)}
      </ul>
    </div>
  );

  return (
    <>
      {/* ============ Version DESKTOP ============ */}
      {/* Toujours visible sur desktop (md et plus) */}
      <aside
        className="hidden md:flex flex-col w-64 bg-blue-900 text-white shadow-xl fixed left-0 top-0 h-full z-40"
        role="navigation"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-blue-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg">PNSQ ANAM</span>
          </div>
        </div>

        {/* Indicateur de connexion */}
        <div className="px-4 py-2 border-b border-blue-800">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Connecté au serveur</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {visibleSections.map(renderSection)}
        </nav>

        {/* Footer avec informations utilisateur */}
        <div className="p-4 border-t border-blue-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {userRole === 'ADMIN' && 'Administrateur'}
                {userRole === 'MANAGER' && 'Responsable'}
                {userRole === 'TECHNICIAN' && 'Technicien'}
                {userRole === 'FORECASTER' && 'Prévisionniste'}
                {userRole === 'CLIMATOLOGIST' && 'Climatologue'}
                {userRole === 'READER' && 'Lecteur'}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} - ANAM
          </p>
        </div>
      </aside>

      {/* ============ Version MOBILE ============ */}
      {/* Affichée uniquement sur mobile quand isOpen est true */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${isOpen ? 'visible' : 'invisible'}`}
        aria-hidden={!isOpen}
      >
        {/* Overlay sombre */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={toggleSidebar}
          aria-label="Fermer le menu"
        ></div>

        {/* Sidebar mobile */}
        <aside
          className={`relative flex flex-col w-64 h-full bg-blue-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-64'
          }`}
          role="navigation"
          aria-label="Navigation mobile"
        >
          {/* Logo + bouton fermer */}
          <div className="flex items-center justify-between h-16 border-b border-blue-800 px-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg">PNSQ ANAM-BF</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-blue-800 rounded-lg transition-colors"
              aria-label="Fermer le menu"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {visibleSections.map(renderSection)}
          </nav>

          {/* Footer avec informations utilisateur */}
          <div className="p-4 border-t border-blue-800 flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="text-sm font-semibold">
                  {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username || 'Utilisateur'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {userRole === 'ADMIN' && 'Administrateur'}
                  {userRole === 'MANAGER' && 'Responsable'}
                  {userRole === 'TECHNICIAN' && 'Technicien'}
                  {userRole === 'FORECASTER' && 'Prévisionniste'}
                  {userRole === 'CLIMATOLOGIST' && 'Climatologue'}
                  {userRole === 'READER' && 'Lecteur'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} - ANAM
            </p>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;