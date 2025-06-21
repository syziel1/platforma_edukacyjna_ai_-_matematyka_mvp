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
import RightPanel from './components/RightPanel/RightPanel';
import VoiceAssistantTest from "./VoiceAssistantTest";

import LandingPage from './components/LandingPage';
import LandingPagePL from './components/LandingPagePL';
import PowersRoots from './components/Formulas/PowersRoots';
import { useAuth } from './contexts/AuthContext';
import { useProgress } from './contexts/ProgressContext';
import { useGlobalTimer } from './hooks/useGlobalTimer';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCockpit, setShowCockpit] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true); // Show landing page by default
  const totalSteps = 5;
  // const { user } = useAuth();
  const { updateProgress } = useProgress();
  const { startLearning, stopLearning } = useGlobalTimer();
  const { currentLanguage } = useLanguage();

  // Upewnij się, że timer jest wyłączony przy starcie aplikacji
  useEffect(() => {
    stopLearning();
  }, []); // Pusta tablica zależności = uruchom tylko raz, po zamontowaniu komponentu

  const handleProblemSelect = (problemId) => {
    setSelectedProblem(problemId);
    setShowCockpit(false);
    setShowStartScreen(false);
    setShowLandingPage(false);
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
    stopLearning();
    setSelectedProblem(null);
    setShowCockpit(true);
    setShowStartScreen(false);
    setShowLandingPage(false);
  };

  const handleShowCockpit = () => {
    stopLearning();
    setShowCockpit(true);
    setShowStartScreen(false);
    setSelectedProblem(null);
    setShowLandingPage(false);    
  };

  const handleShowStartScreen = () => {
    stopLearning();
    setShowStartScreen(true);
    setShowCockpit(false);
    setSelectedProblem(null);
    setShowLandingPage(false);    
  };

  const handleEnterApp = () => {
    stopLearning();
    setShowLandingPage(false);
    setShowCockpit(true);
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
    const LandingComponent = currentLanguage === 'pl' ? LandingPagePL : LandingPage;
    return <LandingComponent onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="h-screen bg-bg-main flex">
      {/* Fixed Navigation Panel */}
      <div /*className="fixed left-0 top-0 bottom-0 z-40"*/>
        <NavigationPanel 
          onLoginClick={() => setShowLogin(true)}
          onShowCockpit={handleShowCockpit}
          onShowStartScreen={handleShowStartScreen}
        />
      </div>

      {/* Main content area with proper margins */}
      <div className="flex-1 flex flex-col"> {/* ml-0 md:ml-16 */}
        {showCockpit ? (
          <CockpitPage onProblemSelect={handleProblemSelect} />
        ) : showStartScreen ? (
          <StartScreen onProblemSelect={handleProblemSelect} />
        ) : selectedProblem ? (
          selectedProblem === 'jungle-game' ? (
            <JungleGame onBack={handleBackToCockpit} startWithModeSelector={true} />
          ) : (
            <div className="flex flex-1">
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                  <LessonHeader 
                    currentStep={currentStep} 
                    totalSteps={totalSteps} 
                    onBack={handleBackToCockpit}
                  />
                  <div className="flex-1 overflow-y-auto">
                    {renderContent()}
                  </div>
                </div>
                {/* Mobile Chat Panel */}
                <div className="md:hidden">
                  <ChatPanel isMobile={true} />
                </div>
              </div>
              {/* Right Panel for lesson pages - Desktop only */}
              <div className="hidden md:block">
                <RightPanel />
              </div>
            </div>
          )
        ) : (
          // Fallback - nie powinno się zdarzyć, ale dla bezpieczeństwa
          <CockpitPage onProblemSelect={handleProblemSelect} />
        )}
      </div>
    </div>
  );
}

export default App;