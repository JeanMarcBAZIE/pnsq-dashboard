// frontend/src/components/Maps/MiniHealthMap.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMap } from 'react-icons/fi';

const MiniHealthMap = () => {
  const navigate = useNavigate();

  // Pour la Phase 5, nous affichons une carte placeholder.
  // En Phase 6, ce composant sera remplacé par une vraie carte Leaflet.
  return (
    <div
      onClick={() => navigate('/map')}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-full min-h-[200px] flex flex-col cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">CARTE DE SANTÉ RAPIDE</h3>
        <FiMap className="w-4 h-4 text-anam-blue" />
      </div>
      <div className="flex-1 bg-gray-50 rounded-md flex items-center justify-center border border-dashed border-gray-300">
        <div className="text-center">
          <FiMap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">Cliquez pour ouvrir la carte interactive</p>
        </div>
      </div>
    </div>
  );
};

export default MiniHealthMap;