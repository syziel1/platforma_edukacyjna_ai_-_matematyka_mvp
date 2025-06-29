import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonLayout from '../components/Layout/LessonLayout';
import EcoTshirtContent from '../components/EcoTshirtContent';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const EcoTshirtLesson = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();
  const { startLearning, stopLearning } = useGlobalTimer();
  const { t } = useLanguage();
  const { t: tEco } = useTranslation('ecoTshirt');

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
    <LessonLayout
      title={tEco('ecoTshirtTitle')}
      onBack={handleBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onStepChange={handleStepChange}
    >
      <EcoTshirtContent 
        currentStep={currentStep} 
        setCurrentStep={handleStepChange} 
      />
    </LessonLayout>
  );
};

export default EcoTshirtLesson;