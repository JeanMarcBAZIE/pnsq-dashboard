// frontend/src/components/Station/StationMetadataTab.jsx

import React from 'react';
import { FiClock, FiUpload, FiAlertCircle } from 'react-icons/fi';

const StationMetadataTab = ({ metadata }) => {
    if (!metadata) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Chargement des méta-données...</p>
            </div>
        );
    }

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatDelay = (seconds) => {
        if (seconds === null || seconds === undefined) return 'N/A';
        if (seconds < 60) return `${Math.round(seconds)} sec`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
        return `${Math.round(seconds / 3600)} h`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <FiUpload className="h-4 w-4 mr-2" />
                Méta-données de transmission (10 dernières observations)
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Heure de mesure
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Heure de réception
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Délai
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                Flag
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {metadata.metadata.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    {formatDate(item.observation_date)}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                    {formatDate(item.reception_date)}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        item.transmission_delay_seconds > 300
                                            ? 'bg-red-100 text-red-800'
                                            : item.transmission_delay_seconds > 60
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {formatDelay(item.transmission_delay_seconds)}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-500">
                                    {item.quality_flag === 0 ? 'OK' :
                                     item.quality_flag === 1 ? 'Suspect' :
                                     item.quality_flag === 2 ? 'Erroné' : 'Manquant'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {metadata.metadata.some((m) => m.transmission_delay_seconds > 300) && (
                <div className="mt-3 flex items-center text-sm text-red-600">
                    <FiAlertCircle className="h-4 w-4 mr-2" />
                    Délais de transmission excessifs détectés (problème potentiel de transmission)
                </div>
            )}
        </div>
    );
};

export default StationMetadataTab;