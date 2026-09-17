// frontend/src/components/Station/StationCharts.jsx

import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceArea,
} from 'recharts';
import { FiAlertCircle } from 'react-icons/fi';

const StationCharts = ({ timeseries, gaps, hours }) => {
    const [selectedParameter, setSelectedParameter] = useState('temperature');
    const [showTooltip, setShowTooltip] = useState(true);

    const parameters = [
        { key: 'temperature', label: 'Température (°C)', color: '#e53e3e' },
        { key: 'humidity', label: 'Humidité (%)', color: '#3182ce' },
        { key: 'wind_speed', label: 'Vent (m/s)', color: '#38a169' },
        { key: 'wind_direction', label: 'Direction (°)', color: '#805ad5' },
        { key: 'pressure_qff', label: 'Pression (hPa)', color: '#dd6b20' },
        { key: 'precipitation', label: 'Précipitations (mm)', color: '#00b5d8' },
    ];

    const currentParam = parameters.find((p) => p.key === selectedParameter);

    // Formater les données pour le graphique
    const chartData = timeseries.map((item) => ({
        ...item,
        time: new Date(item.observation_date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        }),
        fullDate: new Date(item.observation_date).toLocaleString('fr-FR'),
    }));

    // Identifier les plages de lacunes pour le fond coloré
    const gapRanges = gaps?.gaps?.map((gap) => ({
        start: new Date(gap.expected_date).getTime(),
        end: new Date(gap.expected_date).getTime() + gap.duration_minutes * 60000,
    })) || [];

    // Composant Tooltip personnalisé
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-sm">
                    <p className="font-medium text-gray-800">{data.fullDate}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value !== null ? entry.value : 'N/A'}
                            {data[`${entry.dataKey}_corrected`] && (
                                <span className="ml-1 text-xs text-orange-500">(corrigée)</span>
                            )}
                        </p>
                    ))}
                    <p className="text-gray-500 mt-1">
                        Flag qualité: {data.quality_flag_display || 'N/A'}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!timeseries || timeseries.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <FiAlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune donnée disponible pour cette période.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {/* Sélecteur de paramètre */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {parameters.map((param) => (
                    <button
                        key={param.key}
                        onClick={() => setSelectedParameter(param.key)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            selectedParameter === param.key
                                ? 'text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={{
                            backgroundColor: selectedParameter === param.key ? param.color : undefined,
                        }}
                    >
                        {param.label}
                    </button>
                ))}
            </div>

            {/* Graphique */}
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 12, fill: '#718096' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#718096' }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {/* Zones de lacunes */}
                        {gapRanges.map((range, index) => (
                            <ReferenceArea
                                key={index}
                                x1={range.start}
                                x2={range.end}
                                fill="#fed7d7"
                                fillOpacity={0.3}
                            />
                        ))}
                        <Line
                            type="monotone"
                            dataKey={selectedParameter}
                            name={currentParam?.label || selectedParameter}
                            stroke={currentParam?.color || '#3182ce'}
                            strokeWidth={2}
                            dot={false}
                            connectNulls={false} // Pas d'interpolation (RG_3.1)
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Légende des lacunes */}
            {gaps && gaps.total_missing > 0 && (
                <div className="mt-3 flex items-center text-sm text-red-600">
                    <span className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></span>
                    {gaps.total_missing} lacune(s) détectée(s) sur la période
                </div>
            )}
        </div>
    );
};

export default StationCharts;