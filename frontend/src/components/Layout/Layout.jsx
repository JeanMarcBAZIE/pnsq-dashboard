import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

// Fonction pour obtenir le titre de la page en fonction de l'URL
const getPageTitle = (pathname) => {
    const titles = {
        '/': 'Tableau de Bord National',
        '/map': 'Carte Interactive',
        '/alerts': 'Centre d\'Alertes',
        '/reports': 'Rapports & Exports',
        '/settings': 'Administration',
    };
    // Pour les pages dynamiques comme /stations/123
    if (pathname.startsWith('/stations/')) {
        return 'Fiche Station';
    }
    return titles[pathname] || 'PNSQ';
};

const Layout = () => {
    const location = useLocation();
    const title = getPageTitle(location.pathname);

    return (
        <div className="flex h-screen bg-anam-bg">
            {/* Sidebar fixe à gauche */}
            <Sidebar />

            {/* Contenu principal avec Header fixe */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
                <Header title={title} />

                {/* Zone de contenu avec scroll */}
                <main className="flex-1 overflow-y-auto p-4 mt-16">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;