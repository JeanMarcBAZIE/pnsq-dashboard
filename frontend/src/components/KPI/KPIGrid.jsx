// frontend/src/components/KPI/KPIGrid.jsx

import React from 'react';
import KPICard from './KPICard';
import { FiActivity, FiWifi, FiAlertTriangle, FiDatabase } from 'react-icons/fi';

const KPIGrid = ({ kpis }) => {
  if (!kpis) return null;

  const cards = [
    {
      title: 'Complétude',
      value: kpis.completeness,
      unit: '%',
      trend: kpis.completeness_trend,
      icon: FiActivity,
      color: kpis.completeness >= 95 ? 'green' : kpis.completeness >= 80 ? 'orange' : 'red',
    },
    {
      title: 'Stations Actives',
      value: kpis.active_stations,
      unit: '',
      trend: kpis.active_stations_trend,
      icon: FiWifi,
      color: 'blue',
    },
    {
      title: 'Alertes Actives',
      value: kpis.active_alerts,
      unit: '',
      trend: kpis.active_alerts_trend,
      icon: FiAlertTriangle,
      color: kpis.active_alerts > 0 ? 'red' : 'green',
    },
    {
      title: 'Données Brutes',
      value: kpis.raw_data_count?.toLocaleString() || '—',
      unit: '/h',
      trend: kpis.raw_data_trend,
      icon: FiDatabase,
      color: 'blue',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <KPICard key={index} {...card} />
      ))}
    </div>
  );
};

export default KPIGrid;