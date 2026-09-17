// frontend/src/components/Station/StationHeader.jsx

import React from 'react';
import { FiArrowLeft, FiMapPin, FiClock, FiActivity } from 'react-icons/fi';

const StationHeader = ({ station, onBack }) => {
    if (!station) return null;

    const getStatusColor = (status) => {
        const colors = {
            OK: 'bg-green-100 text-green-800 border-green-200',
            WARNING: 'bg-orange-100 text-orange-800 border-orange-200',
            DOWN: 'bg-red-100 text-red-800 border-red-200',
            MAINTENANCE: 'bg-gray-100 text-gray-800 border-gray-200',
            INACTIVE: 'bg-gray-100 text-gray-500 border-gray-200',
        };
        return colors[status] || colors.INACTIVE;
    };

    const getStatusLabel = (status) => {
        const labels = {
            OK: 'Opérationnelle',
            WARNING: 'En alerte',
            DOWN: 'En panne',
            MAINTENANCE: 'En maintenance',
            INACTIVE: 'Inactive',
        };
        return labels[status] || status;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Retour"
                    >
                        <FiArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            {station.name}
                        </h1>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                                <FiMapPin className="h-4 w-4 mr-1" />
                                {station.region} ({station.latitude}, {station.longitude})
                            </span>
                            <span className="flex items-center">
                                <FiActivity className="h-4 w-4 mr-1" />
                                {station.station_type} - {station.code}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(station.status)}`}>
                        {getStatusLabel(station.status)}
                    </span>
                    <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center">
                            <FiClock className="h-4 w-4 mr-1" />
                            Dernière réception: {station.last_data_received
                                ? new Date(station.last_data_received).toLocaleString('fr-FR')
                                : 'Jamais'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StationHeader;