import React, { useState } from 'react';
import NavigationPanel from './components/NavigationPanel';
import LessonHeader from './components/LessonHeader';
import LessonContent from './components/LessonContent';
import WaterTankContent from './components/WaterTankContent';
import ChatPanel from './components/ChatPanel';
import StartScreen from './components/StartScreen';
import LoginScreen from './components/LoginScreen';
import MultiplicationGame from './components/MultiplicationGame';
import { useAuth } from './contexts/AuthContext';
import { useProgress } from './contexts/ProgressContext';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const totalSteps = 5;
  const { user } = useAuth();
  const { updateProgress } = useProgress();

  const handleProblemSelect = (problemId) => {
    setSelectedProblem(problemId);
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

  const renderContent = () => {
    switch (selectedProblem) {
      case 'chicken-coop':
        return <LessonContent currentStep={currentStep} setCurrentStep={handleStepChange} />;
      case 'water-tank':
        return <WaterTankContent currentStep={currentStep} setCurrentStep={handleStepChange} />;
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
    <div className="min-h-screen bg-bg-main flex">
      <NavigationPanel onLoginClick={() => setShowLogin(true)} />

      {selectedProblem ? (
        selectedProblem === 'multiplication-game' ? (
          <div className="flex-1">
            <MultiplicationGame onBack={() => setSelectedProblem(null)} />
          </div>
        ) : (
          <>
            <div className="flex-1 flex flex-col">
              <LessonHeader 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                onBack={() => setSelectedProblem(null)}
              />
              <div className="flex-1 overflow-y-auto">
                {renderContent()}
              </div>
            </div>
            <ChatPanel />
          </>
        )
      ) : (
        <StartScreen onProblemSelect={handleProblemSelect} />
      )}
    </div>
  );
}

export default App;