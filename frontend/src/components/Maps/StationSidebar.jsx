// frontend/src/components/Maps/StationSidebar.jsx

import React from 'react';
import { FiX, FiChevronRight } from 'react-icons/fi';

const StationSidebar = ({ stations, onStationClick, onClose }) => {
  // Trier les stations par statut (les plus critiques en premier)
  const sortedStations = [...stations].sort((a, b) => {
    const statusOrder = { 2: 0, 1: 1, 0: 2, 3: 3 }; // Panne > Retard > OK > HS
    return statusOrder[a.status_code] - statusOrder[b.status_code];
  });

  const getStatusLabel = (statusCode) => {
    const labels = {
      0: { text: 'OK', color: 'text-green-600 bg-green-50' },
      1: { text: 'Retard', color: 'text-orange-600 bg-orange-50' },
      2: { text: 'Panne', color: 'text-red-600 bg-red-50' },
      3: { text: 'Hors Service', color: 'text-gray-500 bg-gray-50' },
    };
    return labels[statusCode] || labels[3];
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* En-tête */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-800">Stations visibles</h3>
          <p className="text-xs text-gray-500">{stations.length} station(s)</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiX className="text-gray-500" />
        </button>
      </div>

      {/* Liste des stations */}
      <div className="flex-1 overflow-y-auto">
        {sortedStations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            Aucune station visible sur la carte.
          </div>
        ) : (
          sortedStations.map((station) => {
            const statusInfo = getStatusLabel(station.status_code);
            return (
              <button
                key={station.station_id}
                onClick={() => onStationClick(station.station_id)}
                className="w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {station.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {station.station_id} • {station.station_type}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {station.last_data_received
                        ? new Date(station.last_data_received).toLocaleString('fr-FR', {
                            timeZone: 'UTC',
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Aucune donnée'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}
                    >
                      {statusInfo.text}
                    </span>
                    <FiChevronRight className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StationSidebar;