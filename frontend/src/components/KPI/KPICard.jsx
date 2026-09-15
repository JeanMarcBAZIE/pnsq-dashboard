// frontend/src/components/KPI/KPICard.jsx

import React from 'react';

const KPICard = ({ title, value, unit, trend, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-anam-blue',
    green: 'text-anam-success',
    red: 'text-anam-danger',
    orange: 'text-anam-warning',
  };

  const trendColor = trend > 0 ? 'text-anam-success' : trend < 0 ? 'text-anam-danger' : 'text-gray-400';
  const trendIcon = trend > 0 ? '▲' : trend < 0 ? '▼' : '—';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[100px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {Icon && <Icon className={`w-5 h-5 ${colorClasses[color]}`} />}
      </div>
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold font-mono text-gray-800">{value}</span>
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </div>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendIcon} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default KPICard;