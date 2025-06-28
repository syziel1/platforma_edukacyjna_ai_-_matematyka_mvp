import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonLayout from '../components/Layout/LessonLayout';
import EcoTshirtContent from '../components/EcoTshirtContent';
import { useGlobalTimer } from '../hooks/useGlobalTimer';
import { useLanguage } from '../contexts/LanguageContext';

const EcoTshirtLesson = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();
  const { startLearning, stopLearning } = useGlobalTimer();
  const { t } = useLanguage();

  // NAPRAWIONE: Automatyczne uruchomienie timera przy wejściu do lekcji
  React.useEffect(() => {
    startLearning(); // Uruchom timer natychmiast
    return () => stopLearning(); // Zatrzymaj przy wyjściu
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
      title={t('ecoTshirtTitle')}
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