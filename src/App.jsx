import React, { useState } from 'react';
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
import { useAuth } from './contexts/AuthContext';
import { useProgress } from './contexts/ProgressContext';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCockpit, setShowCockpit] = useState(true); // Kokpit domyślnie widoczny
  const [showStartScreen, setShowStartScreen] = useState(false);
  const totalSteps = 5;
  const { user } = useAuth();
  const { updateProgress } = useProgress();

  const handleProblemSelect = (problemId) => {
    setSelectedProblem(problemId);
    setShowCockpit(false);
    setShowStartScreen(false);
    
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
  };

  const handleShowCockpit = () => {
    setShowCockpit(true);
    setShowStartScreen(false);
    setSelectedProblem(null);
  };

  const handleShowStartScreen = () => {
    setShowStartScreen(true);
    setShowCockpit(false);
    setSelectedProblem(null);
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
      default:
        return null;
    }
  };

  if (showLogin) {
    return <LoginScreen onSkip={() => setShowLogin(false)} />;
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