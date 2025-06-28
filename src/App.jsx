import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavigationPanel from './components/NavigationPanel';
import GlobalHeader from './components/GlobalHeader';
import LandingPage from './components/LandingPage';
import LandingPagePL from './components/LandingPagePL';
import CockpitPage from './components/ExplorerCockpit/CockpitPage';
import StartScreen from './components/StartScreen';
import LoginScreen from './components/LoginScreen';
import ChickenCoopLesson from './pages/ChickenCoopLesson';
import WaterTankLesson from './pages/WaterTankLesson';
import EcoTshirtLesson from './pages/EcoTshirtLesson';
import JungleGamePage from './pages/JungleGamePage';
import PowersRootsPage from './pages/PowersRootsPage';
import { useAuth } from './contexts/AuthContext';
import { useGlobalTimer } from './contexts/GlobalTimerContext';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { user } = useAuth();
  const { stopLearning } = useGlobalTimer();
  const { currentLanguage } = useLanguage();
  const location = useLocation();

  // Stop learning timer when app starts
  useEffect(() => {
    stopLearning();
  }, [stopLearning]);

  // Check if we're on landing page
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* Navigation Panel - hidden on landing page */}
      {!isLandingPage && (
        <div className="fixed left-0 top-0 bottom-0 z-40">
          <NavigationPanel />
        </div>
      )}

      {/* Main content area */}
      <div className={`flex-1 flex flex-col ${!isLandingPage ? 'ml-0 md:ml-16' : ''}`}>
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
          
          {/* Main App Routes */}
          <Route path="/cockpit" element={<CockpitPage />} />
          <Route path="/lessons" element={<StartScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          
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