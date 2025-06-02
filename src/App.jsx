import React, { useState } from 'react';
import NavigationPanel from './components/NavigationPanel';
import LessonHeader from './components/LessonHeader';
import LessonContent from './components/LessonContent';
import ChatPanel from './components/ChatPanel';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-bg-main flex"> {/* Use new main background */}
      {/* Left Column - Navigation */}
      <NavigationPanel />

      {/* Middle Column - Main Content */}
      <div className="flex-1 flex flex-col">
        <LessonHeader currentStep={currentStep} totalSteps={totalSteps} />
        <div className="flex-1 overflow-y-auto">
          <LessonContent
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </div>

      {/* Right Column - Chat */}
      <ChatPanel />
    </div>
  );
}

export default App;