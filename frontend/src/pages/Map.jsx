// frontend/src/pages/Map.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiList, FiMap } from 'react-icons/fi';
import { useMap } from '../hooks/useMap';
import StationMap from '../components/Maps/StationMap';
import StationSearch from '../components/Maps/StationSearch';
import MapFilters from '../components/Maps/MapFilters';
import StationSidebar from '../components/Maps/StationSidebar';

const MapPage = () => {
  const navigate = useNavigate();
  const {
    stations,
    loading,
    error,
    filters,
    selectedStation,
    countdown,
    updateFilters,
    selectStation,
    refetch,
  } = useMap();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Gérer le clic sur une station (ouvrir le popup ou naviguer)
  const handleStationClick = (stationId) => {
    // Option 1 : Ouvrir la fiche station
    navigate(`/stations/${stationId}`);
    
    // Option 2 : Sélectionner la station pour le popup
    // selectStation(stationId);
  };

  // Gérer la sélection depuis la recherche
  const handleSearchSelect = (station) => {
    // Centrer la carte sur la station (à implémenter avec une ref)
    // Pour l'instant, on navigue vers la fiche station
    navigate(`/stations/${station.station_id}`);
  };

  if (loading && stations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-anam-blue"></div>
        <span className="ml-3 text-gray-500">Chargement de la carte...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Barre d'outils */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <StationSearch
              onSelectStation={handleSearchSelect}
              stations={stations}
            />
            <MapFilters filters={filters} onFilterChange={updateFilters} />
          </div>

          <div className="flex items-center gap-2">
            {/* Compteur de rafraîchissement */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FiRefreshCw className="animate-spin" style={{ animationDuration: '3s' }} />
              <span>Dans {countdown}s</span>
            </div>

            {/* Bouton pour toggle le panneau latéral */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${
                sidebarOpen
                  ? 'bg-anam-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={sidebarOpen ? 'Masquer la liste' : 'Afficher la liste'}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal : Carte + Panneau latéral */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Carte */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <StationMap
            stations={stations}
            onStationClick={handleStationClick}
            selectedStation={selectedStation}
          />
        </div>

        {/* Panneau latéral */}
        {sidebarOpen && (
          <StationSidebar
            stations={stations}
            onStationClick={handleStationClick}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MapPage;