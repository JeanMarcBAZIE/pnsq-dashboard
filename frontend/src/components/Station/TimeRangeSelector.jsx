// frontend/src/components/Station/TimeRangeSelector.jsx

import React from 'react';

const TimeRangeSelector = ({ hours, onChange }) => {
    const options = [
        { value: 6, label: '6h' },
        { value: 12, label: '12h' },
        { value: 24, label: '24h' },
        { value: 48, label: '48h' },
        { value: 72, label: '72h' },
        { value: 168, label: '7j' },
    ];

    return (
        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <span className="text-sm text-gray-500 mr-2">Période:</span>
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        hours === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default TimeRangeSelector;