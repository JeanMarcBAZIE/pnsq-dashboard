import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login'; // Sera créé en Phase 4

// Pages métier (Phase 5 et plus)
import DashboardPage from './pages/Dashboard';
import MapPage from './pages/Map';
import StationPage from './pages/Station';
import AlertsPage from './pages/Alerts';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';

function App() {
  // Simulation d'utilisateur connecté pour le layout (à remplacer plus tard)
  const isAuthenticated = true;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/stations/:stationId" element={<StationPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;