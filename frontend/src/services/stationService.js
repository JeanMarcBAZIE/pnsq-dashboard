// frontend/src/services/stationService.js

import apiClient from './apiClient';

/**
 * Récupère les informations détaillées d'une station.
 * @param {string} stationId - ID de la station
 * @returns {Promise<Object>} Les données de la station
 */
export const getStationDetail = async (stationId) => {
    try {
        const response = await apiClient.get(`/stations/${stationId}/`);
        return response.data.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la station ${stationId}:`, error);
        throw error;
    }
};

/**
 * Récupère les chroniques d'une station.
 * @param {string} stationId - ID de la station
 * @param {number} hours - Nombre d'heures (défaut: 24)
 * @returns {Promise<Array>} Les chroniques
 */
export const getStationTimeseries = async (stationId, hours = 24) => {
    try {
        const response = await apiClient.get(`/stations/${stationId}/timeseries/`, {
            params: { hours }
        });
        return response.data.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des chroniques de ${stationId}:`, error);
        throw error;
    }
};

/**
 * Récupère les lacunes d'une station.
 * @param {string} stationId - ID de la station
 * @param {number} hours - Nombre d'heures (défaut: 24)
 * @returns {Promise<Object>} Les lacunes
 */
export const getStationGaps = async (stationId, hours = 24) => {
    try {
        const response = await apiClient.get(`/stations/${stationId}/gaps/`, {
            params: { hours }
        });
        return response.data.data;
    } catch (error) {
        console.error(`Erreur lors du calcul des lacunes de ${stationId}:`, error);
        throw error;
    }
};

/**
 * Récupère les méta-données de transmission d'une station.
 * @param {string} stationId - ID de la station
 * @returns {Promise<Object>} Les méta-données
 */
export const getStationMetadata = async (stationId) => {
    try {
        const response = await apiClient.get(`/stations/${stationId}/metadata/`);
        return response.data.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des métadonnées de ${stationId}:`, error);
        throw error;
    }
};