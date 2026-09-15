// frontend/src/hooks/useDashboard.js

import { useState, useEffect, useCallback } from 'react';
import { getNationalDashboardData } from '../services/dashboardService';

const REFRESH_INTERVAL = 60000; // 60 secondes, conforme à la RG_1.3

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(60);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getNationalDashboardData();
      setData(result);
      setError(null);
      setCountdown(60); // Réinitialiser le compteur
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Rafraîchissement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, countdown, refetch: fetchData };
};