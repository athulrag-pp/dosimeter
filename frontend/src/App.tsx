import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { ScanResultPage } from './pages/ScanResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { WristbandPage } from './pages/WristbandPage';
import { CalibrationPage } from './pages/CalibrationPage';
import { AlertsPage } from './pages/AlertsPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar onLaunchDemo={() => navigate('/scan?demo=true')} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/result" element={<ScanResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/wristband" element={<WristbandPage />} />
          <Route path="/calibration" element={<CalibrationPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/profile" element={<WorkerProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
