import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonHeader from '../components/LessonHeader';
import ChickenCoopContent from '../components/ChickenCoopContent';
import ChatPanel from '../components/ChatPanel';
import RightPanel from '../components/RightPanel/RightPanel';
import { useGlobalTimer } from '../hooks/useGlobalTimer';
import { useLanguage } from '../contexts/LanguageContext';

const ChickenCoopLesson = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const navigate = useNavigate();
  const { startLearning, stopLearning } = useGlobalTimer();
  const { t } = useLanguage();

  React.useEffect(() => {
    startLearning();
    return () => stopLearning();
  }, [startLearning, stopLearning]);

  const handleBack = () => {
    stopLearning();
    navigate('/cockpit');
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
    // Update progress in localStorage or context if needed
  };

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <LessonHeader 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            onBack={handleBack}
            title={t('lessonChickenCoop')}
          />
          <div className="flex-1 overflow-y-auto">
            <ChickenCoopContent 
              currentStep={currentStep} 
              setCurrentStep={handleStepChange} 
            />
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
  );
};

export default ChickenCoopLesson;