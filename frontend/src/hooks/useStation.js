// frontend/src/hooks/useStation.js

import { useState, useEffect, useCallback } from 'react';
import {
    getStationDetail,
    getStationTimeseries,
    getStationGaps,
    getStationMetadata,
} from '../services/stationService';

const REFRESH_INTERVAL = 60000; // 60 secondes, conforme à la RG_1.3

export const useStation = (stationId) => {
    const [station, setStation] = useState(null);
    const [timeseries, setTimeseries] = useState([]);
    const [gaps, setGaps] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hours, setHours] = useState(24);
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);

    const fetchData = useCallback(async () => {
        if (!stationId) return;

        setLoading(true);
        setError(null);

        try {
            const [stationData, timeseriesData, gapsData, metadataData] = await Promise.all([
                getStationDetail(stationId),
                getStationTimeseries(stationId, hours),
                getStationGaps(stationId, hours),
                getStationMetadata(stationId),
            ]);

            setStation(stationData);
            setTimeseries(timeseriesData);
            setGaps(gapsData);
            setMetadata(metadataData);
        } catch (err) {
            setError(err.message || 'Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    }, [stationId, hours]);

    // Chargement initial et rechargement quand hours change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Rafraîchissement automatique toutes les 60 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    fetchData();
                    return REFRESH_INTERVAL / 1000;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [fetchData]);

    // Réinitialiser le countdown quand hours change
    useEffect(() => {
        setCountdown(REFRESH_INTERVAL / 1000);
    }, [hours]);

    return {
        station,
        timeseries,
        gaps,
        metadata,
        loading,
        error,
        hours,
        setHours,
        countdown,
        refresh: fetchData,
    };
};