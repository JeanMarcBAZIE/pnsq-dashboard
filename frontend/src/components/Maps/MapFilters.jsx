// frontend/src/components/Maps/MapFilters.jsx

import React from 'react';
import { FiFilter } from 'react-icons/fi';

const MapFilters = ({ filters, onFilterChange }) => {
  const stationTypes = [
    { value: 'ALL', label: 'Tous les types' },
    { value: 'SYNOP', label: 'SYNOP' },
    { value: 'AWS', label: 'AWS' },
    { value: 'CLIMAT', label: 'Climatologique' },
    { value: 'RAIN', label: 'Pluviométrique' },
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Tous les statuts' },
    { value: 'OK', label: 'Opérationnelle' },
    { value: 'WARNING', label: 'En alerte' },
    { value: 'DOWN', label: 'En panne' },
    { value: 'MAINTENANCE', label: 'En maintenance' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <FiFilter className="text-gray-400" />
        <span className="text-sm text-gray-600 font-medium">Filtres :</span>
      </div>

      {/* Filtre par type de station */}
      <select
        value={filters.type || 'ALL'}
        onChange={(e) => onFilterChange({ type: e.target.value })}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anam-blue"
      >
        {stationTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {/* Filtre par statut */}
      <select
        value={filters.status || 'ALL'}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anam-blue"
      >
        {statusOptions.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      {/* Bouton de réinitialisation */}
      {(filters.type !== 'ALL' || filters.status !== 'ALL') && (
        <button
          onClick={() => onFilterChange({ type: 'ALL', status: 'ALL' })}
          className="text-xs text-anam-blue hover:text-blue-800 underline"
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
};

export default MapFilters;