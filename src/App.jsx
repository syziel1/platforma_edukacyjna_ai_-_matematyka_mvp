import React, { useState } from 'react';
import NavigationPanel from './components/NavigationPanel';
import LessonHeader from './components/LessonHeader';
import LessonContent from './components/LessonContent';
import WaterTankContent from './components/WaterTankContent';
import ChatPanel from './components/ChatPanel';
import StartScreen from './components/StartScreen';
import LoginScreen from './components/LoginScreen';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const totalSteps = 5;
  const { user } = useAuth();

  const handleProblemSelect = (problemId) => {
    setSelectedProblem(problemId);
    setCurrentStep(1);
  };

  const renderContent = () => {
    switch (selectedProblem) {
      case 'chicken-coop':
        return <LessonContent currentStep={currentStep} setCurrentStep={setCurrentStep} />;
      case 'water-tank':
        return <WaterTankContent currentStep={currentStep} setCurrentStep={setCurrentStep} />;
      default:
        return null;
    }
  };

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-bg-main flex">
      <NavigationPanel />

      {selectedProblem ? (
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
      ) : (
        <StartScreen onProblemSelect={handleProblemSelect} />
      )}
    </div>
  );
}

export default App;