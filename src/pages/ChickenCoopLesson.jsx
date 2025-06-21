import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonLayout from '../components/Layout/LessonLayout';
import ChickenCoopContent from '../components/ChickenCoopContent';
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