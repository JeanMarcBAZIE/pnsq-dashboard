// frontend/src/pages/Station.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStation } from '../hooks/useStation';
import StationHeader from '../components/Station/StationHeader';
import TimeRangeSelector from '../components/Station/TimeRangeSelector';
import StationCharts from '../components/Station/StationCharts';
import StationGapsTab from '../components/Station/StationGapsTab';
import StationMetadataTab from '../components/Station/StationMetadataTab';
import { FiRefreshCw, FiDownload, FiAlertCircle } from 'react-icons/fi';

const StationPage = () => {
    const { stationId } = useParams();
    const navigate = useNavigate();
    const {
        station,
        timeseries,
        gaps,
        metadata,
        loading,
        error,
        hours,
        setHours,
        countdown,
        refresh,
    } = useStation(stationId);

    const [activeTab, setActiveTab] = useState('charts');

    const tabs = [
        { id: 'charts', label: 'Chroniques & Lacunes' },
        { id: 'gaps', label: 'Lacunes' },
        { id: 'metadata', label: 'Méta-données' },
    ];

    const handleExportCSV = () => {
        if (!timeseries || timeseries.length === 0) return;

        const headers = [
            'Date',
            'Température (°C)',
            'Humidité (%)',
            'Vent (m/s)',
            'Direction (°)',
            'Pression (hPa)',
            'Précipitations (mm)',
            'Flag Qualité',
        ];

        const rows = timeseries.map((item) => [
            item.observation_date,
            item.temperature ?? '',
            item.humidity ?? '',
            item.wind_speed ?? '',
            item.wind_direction ?? '',
            item.pressure_qff ?? '',
            item.precipitation ?? '',
            item.quality_flag ?? '',
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.join(';'))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `station_${stationId}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading && !station) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500">Chargement de la fiche station...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <FiAlertCircle className="h-12 w-12 text-red-500 mb-3" />
                <p className="text-red-600 font-medium">Erreur: {error}</p>
                <button
                    onClick={() => navigate('/map')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Retour à la carte
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* En-tête de la station */}
            <StationHeader station={station} onBack={() => navigate(-1)} />

            {/* Barre d'outils */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <TimeRangeSelector hours={hours} onChange={setHours} />
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                        Rafraîchissement dans {countdown}s
                    </span>
                    <button
                        onClick={refresh}
                        className="p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                        title="Rafraîchir"
                    >
                        <FiRefreshCw className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <FiDownload className="h-4 w-4 mr-2" />
                        Exporter CSV
                    </button>
                </div>
            </div>

            {/* Onglets */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenu de l'onglet actif */}
            <div>
                {activeTab === 'charts' && (
                    <StationCharts timeseries={timeseries} gaps={gaps} hours={hours} />
                )}
                {activeTab === 'gaps' && <StationGapsTab gaps={gaps} />}
                {activeTab === 'metadata' && <StationMetadataTab metadata={metadata} />}
            </div>
        </div>
    );
};

export default StationPage;