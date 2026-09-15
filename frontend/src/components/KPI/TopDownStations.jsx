// frontend/src/components/KPI/TopDownStations.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const TopDownStations = ({ stations }) => {
  const navigate = useNavigate();

  if (!stations || stations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">TOP STATIONS EN PANNE</h3>
        <p className="text-sm text-gray-400 text-center py-4">Aucune station en panne</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">TOP STATIONS EN PANNE</h3>
      <div className="space-y-1">
        {stations.map((station, index) => (
          <div
            key={station.station_id}
            onClick={() => navigate(`/stations/${station.station_id}`)}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-gray-400 w-4">{index + 1}.</span>
              <div>
                <p className="text-sm font-medium text-gray-800 group-hover:text-anam-blue">
                  {station.name}
                </p>
                <p className="text-xs text-gray-400">{station.region}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-anam-danger">
                {station.duration}
              </span>
              <FiChevronRight className="w-4 h-4 text-gray-300 group-hover:text-anam-blue" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDownStations;