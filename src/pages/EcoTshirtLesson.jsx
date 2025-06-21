import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonHeader from '../components/LessonHeader';
import EcoTshirtContent from '../components/EcoTshirtContent';
import ChatPanel from '../components/ChatPanel';
import RightPanel from '../components/RightPanel/RightPanel';
import { useGlobalTimer } from '../hooks/useGlobalTimer';
import { useLanguage } from '../contexts/LanguageContext';

const EcoTshirtLesson = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
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
  };

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <LessonHeader 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            onBack={handleBack}
            title={t('ecoTshirtTitle')}
          />
          <div className="flex-1 overflow-y-auto">
            <EcoTshirtContent 
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

export default EcoTshirtLesson;