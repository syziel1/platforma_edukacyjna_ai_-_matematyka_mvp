import React, { useState } from 'react';
import NavigationPanel from './components/NavigationPanel';
import LessonHeader from './components/LessonHeader';
import LessonContent from './components/LessonContent';
import WaterTankContent from './components/WaterTankContent';
import EcoTshirtContent from './components/EcoTshirtContent';
import ChatPanel from './components/ChatPanel';
import StartScreen from './components/StartScreen';
import LoginScreen from './components/LoginScreen';
import MultiplicationGame from './components/MultiplicationGame';
import KokpitPage from './components/KokpitOdkrywcy/KokpitPage';
import { useAuth } from './contexts/AuthContext';
import { useProgress } from './contexts/ProgressContext';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showKokpit, setShowKokpit] = useState(false);
  const totalSteps = 5;
  const { user } = useAuth();
  const { updateProgress } = useProgress();

  const handleProblemSelect = (problemId) => {
    setSelectedProblem(problemId);
    setShowKokpit(false);
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

  const handleBackToKokpit = () => {
    setSelectedProblem(null);
    setShowKokpit(true);
  };

  const handleShowKokpit = () => {
    setShowKokpit(true);
    setSelectedProblem(null);
  };

  const renderContent = () => {
    switch (selectedProblem) {
      case 'chicken-coop':
        return <LessonContent currentStep={currentStep} setCurrentStep={handleStepChange} />;
      case 'water-tank':
        return <WaterTankContent currentStep={currentStep} setCurrentStep={handleStepChange} />;
      case 'eco-tshirt':
        return <EcoTshirtContent currentStep={currentStep} setCurrentStep={handleStepChange} />;
      case 'multiplication-game':
        return <MultiplicationGame />;
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
        onShowKokpit={user ? handleShowKokpit : null}
      />

      {showKokpit && user ? (
        <div className="flex-1 pt-16 md:pt-0">
          <KokpitPage onProblemSelect={handleProblemSelect} />
        </div>
      ) : selectedProblem ? (
        selectedProblem === 'multiplication-game' ? (
          <div className="flex-1 pt-16 md:pt-0">
            <MultiplicationGame onBack={user ? handleBackToKokpit : () => setSelectedProblem(null)} />
          </div>
        ) : (
          <div className="flex flex-1">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col pt-16 md:pt-0">
                <LessonHeader 
                  currentStep={currentStep} 
                  totalSteps={totalSteps} 
                  onBack={user ? handleBackToKokpit : () => setSelectedProblem(null)}
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
        <div className="flex-1 pt-16 md:pt-0">
          <StartScreen onProblemSelect={handleProblemSelect} />
        </div>
      )}
    </div>
  );
}

export default App;