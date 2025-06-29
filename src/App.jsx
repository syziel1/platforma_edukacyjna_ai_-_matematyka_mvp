import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavigationPanel from './components/NavigationPanel';
import GlobalHeader from './components/GlobalHeader';
import LandingPage from './components/LandingPage';
import LandingPagePL from './components/LandingPagePL';
import CockpitPage from './components/ExplorerCockpit/CockpitPage';
import StartScreen from './components/StartScreen';
import ChickenCoopLesson from './pages/ChickenCoopLesson';
import WaterTankLesson from './pages/WaterTankLesson';
import EcoTshirtLesson from './pages/EcoTshirtLesson';
import JungleGamePage from './pages/JungleGamePage';
import PowersRootsPage from './pages/PowersRootsPage';

// Auth components
import RoleSelectionPage from './components/Auth/RoleSelectionPage';
import RegisterPage from './components/Auth/RegisterPage';
import LoginPage from './components/Auth/LoginPage';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage';
import ResetPasswordPage from './components/Auth/ResetPasswordPage';
import AuthCallback from './components/Auth/AuthCallback';

import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { user, loading } = useAuth();
  const { currentLanguage } = useLanguage();
  const location = useLocation();

  // Check if we're on landing page or auth pages
  const isLandingPage = location.pathname === '/';
  const isAuthPage = ['/register-role', '/register', '/login', '/forgot-password', '/reset-password', '/auth/callback'].includes(location.pathname);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-color">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* Navigation Panel - hidden on landing page and auth pages */}
      {!isLandingPage && !isAuthPage && (
        <div className="fixed left-0 top-0 bottom-0 z-40">
          <NavigationPanel />
        </div>
      )}

      {/* Main content area */}
      <div className={`flex-1 flex flex-col ${!isLandingPage && !isAuthPage ? 'ml-0 md:ml-16' : ''}`}>
        <Routes>
          {/* Landing Page */}
          <Route 
            path="/" 
            element={
              currentLanguage === 'pl' ? 
                <LandingPagePL onEnterApp={() => window.location.href = '/cockpit'} /> : 
                <LandingPage onEnterApp={() => window.location.href = '/cockpit'} />
            } 
          />
          
          {/* Auth Routes */}
          <Route path="/register-role" element={<RoleSelectionPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Main App Routes */}
          <Route path="/cockpit" element={<CockpitPage />} />
          <Route path="/lessons" element={<StartScreen />} />
          
          {/* Lesson Routes */}
          <Route path="/lesson/chicken-coop" element={<ChickenCoopLesson />} />
          <Route path="/lesson/water-tank" element={<WaterTankLesson />} />
          <Route path="/lesson/eco-tshirt" element={<EcoTshirtLesson />} />
          <Route path="/lesson/powers-roots" element={<PowersRootsPage />} />
          
          {/* Game Routes */}
          <Route path="/game/jungle" element={<JungleGamePage />} />
          
          {/* Redirect unknown routes to cockpit */}
          <Route path="*" element={<Navigate to="/cockpit" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;