import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Station from './pages/Station';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Page de login accessible à tous */}
                    <Route path="/login" element={<Login />} />

                    {/* Routes protégées avec Layout */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/map" element={<Map />} />
                            <Route path="/stations/:id" element={<Station />} />
                            <Route path="/alerts" element={<Alerts />} />
                            <Route path="/reports" element={<Reports />} />
                            {/* Routes réservées aux Admins/Managers */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
                                <Route path="/settings" element={<Settings />} />
                            </Route>
                        </Route>
                    </Route>

                    {/* Redirection par défaut */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;