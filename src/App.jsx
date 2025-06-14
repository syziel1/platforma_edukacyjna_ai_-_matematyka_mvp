import React, { useState, useEffect } from 'react';
import NavigationPanel from './components/NavigationPanel';
import LessonHeader from './components/LessonHeader';
import ChickenCoopContent from './components/ChickenCoopContent';
import WaterTankContent from './components/WaterTankContent';
import EcoTshirtContent from './components/EcoTshirtContent';
import ChatPanel from './components/ChatPanel';
import StartScreen from './components/StartScreen';
import LoginScreen from './components/LoginScreen';
import JungleGame from './components/JungleGame';
import CockpitPage from './components/ExplorerCockpit/CockpitPage';
import LandingPage from './components/LandingPage';
import PowersRoots from './components/Formulas/PowersRoots';
import { useAuth } from './contexts/AuthContext';
import { useProgress } from './contexts/ProgressContext';
import { useGlobalTimer } from './hooks/useGlobalTimer';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCockpit, setShowCockpit] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true); // Show landing page by default
  const totalSteps = 5;
  const { user } = useAuth();
  const { updateProgress } = useProgress();
  const { startLearning, stopLearning } = useGlobalTimer();

  const handleProblemSelect = (problemId) => {
    setSelectedProblem(problemId);
    setShowCockpit(false);
    setShowStartScreen(false);
    setShowLandingPage(false);
    
    // Rozpocznij liczenie czasu nauki
    startLearning();
    
    // For jungle-game, always start with mode selector
    if (problemId === 'jungle-game') {
      // The JungleGame component will handle showing the mode selector
      const savedProgress = localStorage.getItem('lessonProgress');
      const progress = savedProgress ? JSON.parse(savedProgress)[problemId] || 1 : 1;
      setCurrentStep(progress);
      return;
    }
    
    const savedProgress = localStorage.getItem('lessonProgress');
    const progress = savedProgress ? JSON.parse(savedProgress)[problemId] || 1 : 1;
    setCurrentStep(progress);
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
    if (selectedProblem) {
      updateProgress(selectedProblem, step);
    }
  };

  const handleBackToCockpit = () => {
    setSelectedProblem(null);
    setShowCockpit(true);
    setShowStartScreen(false);
    setShowLandingPage(false);
    
    // Zatrzymaj liczenie czasu nauki
    stopLearning();
  };

  const handleShowCockpit = () => {
    setShowCockpit(true);
    setShowStartScreen(false);
    setSelectedProblem(null);
    setShowLandingPage(false);
    
    // Zatrzymaj liczenie czasu nauki jeśli było aktywne
    stopLearning();
  };

  const handleShowStartScreen = () => {
    setShowStartScreen(true);
    setShowCockpit(false);
    setSelectedProblem(null);
    setShowLandingPage(false);
    
    // Zatrzymaj liczenie czasu nauki jeśli było aktywne
    stopLearning();
  };

  const handleEnterApp = () => {
    setShowLandingPage(false);
    setShowCockpit(true);
    stopLearning();
  };

  const renderContent = () => {
    switch (selectedProblem) {
      case 'chicken-coop':
        return <ChickenCoopContent currentStep={currentStep} setCurrentStep={handleStepChange} />;
      case 'water-tank':
        return <WaterTankContent currentStep={currentStep} setCurrentStep={handleStepChange} />;
      case 'eco-tshirt':
        return <EcoTshirtContent currentStep={currentStep} setCurrentStep={handleStepChange} />;
      case 'jungle-game':
        return <JungleGame startWithModeSelector={true} />;
      case 'powers-roots':
        return <PowersRoots />;
      default:
        return null;
    }
  };

  if (showLogin) {
    return <LoginScreen onSkip={() => setShowLogin(false)} />;
  }

  if (showLandingPage) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="min-h-screen bg-bg-main flex relative">
      <NavigationPanel 
        onLoginClick={() => setShowLogin(true)}
        onShowCockpit={handleShowCockpit}
        onShowStartScreen={handleShowStartScreen}
      />

      {showCockpit ? (
        <div className="flex-1 pt-16 md:pt-0">
          <CockpitPage onProblemSelect={handleProblemSelect} />
        </div>
      ) : showStartScreen ? (
        <div className="flex-1 pt-16 md:pt-0">
          <StartScreen onProblemSelect={handleProblemSelect} />
        </div>
      ) : selectedProblem ? (
        selectedProblem === 'jungle-game' ? (
          <div className="flex-1 pt-16 md:pt-0">
            <JungleGame onBack={handleBackToCockpit} startWithModeSelector={true} />
          </div>
        ) : (
          <div className="flex flex-1">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col pt-16 md:pt-0">
                <LessonHeader 
                  currentStep={currentStep} 
                  totalSteps={totalSteps} 
                  onBack={handleBackToCockpit}
                />
                <div className="flex-1 overflow-y-auto">
                  {renderContent()}
                </div>
              </div>
              <div className="md:hidden">
                <ChatPanel isMobile={true} />
              </div>
            </div>
            <div className="hidden md:block">
              <ChatPanel />
            </div>
          </div>
        )
      ) : (
        // Fallback - nie powinno się zdarzyć, ale dla bezpieczeństwa
        <div className="flex-1 pt-16 md:pt-0">
          <CockpitPage onProblemSelect={handleProblemSelect} />
        </div>
      )}
    </div>
  );
}

export default App;