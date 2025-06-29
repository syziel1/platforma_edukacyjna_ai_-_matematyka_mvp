import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonLayout from '../components/Layout/LessonLayout';
import ChickenCoopContent from '../components/ChickenCoopContent';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';
import { useTranslation } from 'react-i18next';

const ChickenCoopLesson = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const navigate = useNavigate();
  const { startLearning, stopLearning } = useGlobalTimer();
  const { t } = useTranslation('common');
  const { t: tChicken } = useTranslation('chickenCoop');

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
    <LessonLayout
      title={t('lessonChickenCoop')}
      onBack={handleBack}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onStepChange={handleStepChange}
    >
      <ChickenCoopContent 
        currentStep={currentStep} 
        setCurrentStep={handleStepChange} 
      />
    </LessonLayout>
  );
};

export default ChickenCoopLesson;