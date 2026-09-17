// frontend/src/components/Station/StationGapsTab.jsx

import React from 'react';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const StationGapsTab = ({ gaps }) => {
    if (!gaps) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Chargement des lacunes...</p>
            </div>
        );
    }

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {/* Résumé */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500">Intervalle</p>
                    <p className="text-lg font-bold text-gray-800">{gaps.interval_minutes} min</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500">Attendu</p>
                    <p className="text-lg font-bold text-gray-800">{gaps.total_expected}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500">Reçu</p>
                    <p className="text-lg font-bold text-green-600">{gaps.total_received}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500">Manquant</p>
                    <p className="text-lg font-bold text-red-600">{gaps.total_missing}</p>
                </div>
            </div>

            {/* Taux de complétude */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Taux de complétude</span>
                    <span className={`text-sm font-bold ${
                        gaps.completeness >= 95 ? 'text-green-600' :
                        gaps.completeness >= 80 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                        {gaps.completeness}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${
                            gaps.completeness >= 95 ? 'bg-green-500' :
                            gaps.completeness >= 80 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${gaps.completeness}%` }}
                    ></div>
                </div>
            </div>

            {/* Liste des lacunes */}
            {gaps.gaps.length > 0 ? (
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiAlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                        Horodatages manquants
                    </h3>
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Date attendue
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Durée
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {gaps.gaps.map((gap, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-700">
                                            {formatDate(gap.expected_date)}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500">
                                            {gap.duration_minutes} min
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-4">
                    <FiCheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucune lacune détectée sur la période.</p>
                </div>
            )}
        </div>
    );
};

export default StationGapsTab;