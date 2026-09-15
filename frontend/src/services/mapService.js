// frontend/src/services/mapService.js

import apiClient from './apiClient';

/**
 * Récupère toutes les stations pour la carte interactive.
 * @param {Object} filters - Filtres optionnels (type, status, region)
 * @returns {Promise<Array>} Liste des stations
 */
export const getMapStations = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.type && filters.type !== 'ALL') {
      params.append('type', filters.type);
    }
    if (filters.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    if (filters.region) {
      params.append('region', filters.region);
    }

    const response = await apiClient.get(`/map/stations/?${params.toString()}`);
    return response.data.stations;
  } catch (error) {
    console.error('Erreur lors de la récupération des stations de la carte:', error);
    throw error;
  }
};

/**
 * Récupère les détails d'une station spécifique.
 * @param {string} stationId - L'ID de la station
 * @returns {Promise<Object>} Détails de la station
 */
export const getStationDetails = async (stationId) => {
  try {
    const response = await apiClient.get(`/map/stations/${stationId}/`);
    return response.data.station;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la station ${stationId}:`, error);
    throw error;
  }
};

/**
 * Recherche des stations par nom ou code.
 * @param {string} query - La requête de recherche
 * @returns {Promise<Array>} Liste des stations correspondantes
 */
export const searchStations = async (query) => {
  try {
    const response = await apiClient.get(`/map/stations/?search=${query}`);
    return response.data.stations;
  } catch (error) {
    console.error('Erreur lors de la recherche de stations:', error);
    throw error;
  }
};