// frontend/src/components/Maps/StationSearch.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchStations } from '../../services/mapService';

const StationSearch = ({ onSelectStation, stations }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Fermer la liste si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche locale dans les stations déjà chargées
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = stations.filter(
      (station) =>
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.station_id.toLowerCase().includes(query.toLowerCase()) ||
        station.code.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 10)); // Limiter à 10 résultats
    setIsOpen(filtered.length > 0);
  }, [query, stations]);

  const handleSelect = (station) => {
    setQuery('');
    setIsOpen(false);
    onSelectStation(station);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une station..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-anam-blue focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-[1001] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((station) => (
            <button
              key={station.station_id}
              onClick={() => handleSelect(station)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-800">{station.name}</p>
                  <p className="text-xs text-gray-500">
                    {station.station_id} • {station.station_type}
                  </p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: station.color }}
                ></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StationSearch;