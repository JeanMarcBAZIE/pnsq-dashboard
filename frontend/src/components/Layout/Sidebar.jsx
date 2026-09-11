import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiMap,
  FiBell,
  FiFileText,
  FiSettings,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  // On simule 3 alertes non acquittées pour le badge
  const alertCount = 3;

  const navItems = [
    { to: '/dashboard', icon: <FiHome />, label: 'Tableau de Bord' },
    { to: '/map', icon: <FiMap />, label: 'Carte Interactive' },
    { to: '/alerts', icon: <FiBell />, label: 'Centre d\'Alertes', badge: alertCount },
    { to: '/reports', icon: <FiFileText />, label: 'Rapports & Exports' },
    { to: '/settings', icon: <FiSettings />, label: 'Paramétrage' },
  ];

  return (
    <>
      {/* ============ Version DESKTOP ============ */}
      {/* Toujours visible sur desktop (md et plus) */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-900 text-white shadow-lg fixed left-0 top-0 h-full z-40">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-blue-800">
          <span className="font-bold text-xl">PNSQ ANAM</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                    ${isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-blue-800 hover:text-white'}
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="ml-3">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-800 text-xs text-gray-400">
          {new Date().getFullYear()} - ANAM
        </div>
      </aside>

      {/* ============ Version MOBILE ============ */}
      {/* Affichée uniquement sur mobile quand isOpen est true */}
      <div className={`md:hidden fixed inset-0 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
        {/* Overlay sombre */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={toggleSidebar}
        ></div>

        {/* Sidebar mobile */}
        <aside
          className={`relative flex flex-col w-64 h-full bg-blue-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-64'
          }`}
        >
          {/* Logo + bouton fermer */}
          <div className="flex items-center justify-between h-16 border-b border-blue-800 px-4">
            <span className="font-bold text-xl">PNSQ ANAM</span>
            <button onClick={toggleSidebar} className="p-1 hover:bg-blue-800 rounded">
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-3">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                      ${isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-gray-300 hover:bg-blue-800 hover:text-white'}
                    `}
                    onClick={toggleSidebar}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="ml-3">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-800 text-xs text-gray-400">
            {new Date().getFullYear()} - ANAM
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;