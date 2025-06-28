import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonLayout from '../components/Layout/LessonLayout';
import WaterTankContent from '../components/WaterTankContent';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';
import { useLanguage } from '../contexts/LanguageContext';

const WaterTankLesson = () => {
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
    <LessonLayout
      title={t('waterTankTitle')}
      onBack={handleBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onStepChange={handleStepChange}
    >
      <WaterTankContent 
        currentStep={currentStep} 
        setCurrentStep={handleStepChange} 
      />
    </LessonLayout>
  );
};

export default WaterTankLesson;