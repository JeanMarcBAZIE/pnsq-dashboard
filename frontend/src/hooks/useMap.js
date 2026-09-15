// frontend/src/hooks/useMap.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { getMapStations, getStationDetails } from '../services/mapService';

const REFRESH_INTERVAL = 60000; // 60 secondes, conforme à la RG_1.3

export const useMap = (initialFilters = {}) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedStation, setSelectedStation] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Fonction pour charger les stations
  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMapStations(filters);
      setStations(data);
      setCountdown(60);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des stations');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Charger les stations au montage et quand les filtres changent
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Rafraîchissement automatique toutes les 60 secondes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchStations();
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStations]);

  // Compteur de rafraîchissement
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 60;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Fonction pour sélectionner une station (ouvrir le popup)
  const selectStation = useCallback(async (stationId) => {
    try {
      const details = await getStationDetails(stationId);
      setSelectedStation(details);
      return details;
    } catch (err) {
      console.error('Erreur lors de la sélection de la station:', err);
      return null;
    }
  }, []);

  // Fonction pour fermer le popup
  const deselectStation = useCallback(() => {
    setSelectedStation(null);
  }, []);

  // Fonction pour mettre à jour les filtres
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Fonction pour forcer le rafraîchissement
  const refetch = useCallback(() => {
    fetchStations();
  }, [fetchStations]);

  return {
    stations,
    loading,
    error,
    filters,
    selectedStation,
    countdown,
    updateFilters,
    selectStation,
    deselectStation,
    refetch,
  };
};