// frontend/src/services/dashboardService.js

import apiClient from './apiClient';

/**
 * Récupère toutes les données du Tableau de Bord National.
 * @returns {Promise<Object>} Les données du dashboard (KPIs + Top Stations)
 */
export const getNationalDashboardData = async () => {
  try {
    const response = await apiClient.get('/dashboard/national/');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du dashboard:', error);
    throw error;
  }
};