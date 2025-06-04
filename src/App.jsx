import React, { useState } from 'react';
import NavigationPanel from './components/NavigationPanel';
import LessonHeader from './components/LessonHeader';
import LessonContent from './components/LessonContent';
import ChatPanel from './components/ChatPanel';
import StartScreen from './components/StartScreen';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const totalSteps = 5;

  const handleProblemSelect = (problemId) => {
    setSelectedProblem(problemId);
    setCurrentStep(1);
  };

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
              <LessonContent
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
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