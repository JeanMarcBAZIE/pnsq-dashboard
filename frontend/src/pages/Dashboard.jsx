// frontend/src/pages/Dashboard.jsx

import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import KPIGrid from '../components/KPI/KPIGrid';
import TopDownStations from '../components/KPI/TopDownStations';
import MiniHealthMap from '../components/Maps/MiniHealthMap';
import { FiRefreshCw } from 'react-icons/fi';

const DashboardPage = () => {
  const { data, loading, error, countdown, refetch } = useDashboard();

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-anam-blue"></div>
        <span className="ml-3 text-gray-500">Chargement du tableau de bord...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-anam-danger font-medium">Erreur de chargement</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
        <button
          onClick={refetch}
          className="mt-3 px-4 py-2 bg-anam-blue text-white rounded-md text-sm hover:bg-opacity-90"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section KPIs */}
      <section>
        <KPIGrid kpis={data?.kpis} />
      </section>

      {/* Section Carte + Top Stations */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MiniHealthMap />
        </div>
        <div className="lg:col-span-1">
          <TopDownStations stations={data?.top_down_stations} />
        </div>
      </section>

      {/* Barre de statut / Compteur de rafraîchissement */}
      <footer className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-200 pt-3">
        <div className="flex items-center space-x-2">
          <FiRefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Prochaine mise à jour dans {countdown} sec</span>
        </div>
        <span>
          Dernière mise à jour : {data?.kpis?.last_updated
            ? new Date(data.kpis.last_updated).toLocaleTimeString('fr-FR')
            : '—'}
        </span>
      </footer>
    </div>
  );
};

export default DashboardPage;