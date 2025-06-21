import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import GlobalHeader from './GlobalHeader';
import { useLanguage } from '../contexts/LanguageContext';

const LessonHeader = ({ currentStep, totalSteps, onBack, title }) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="bg-bg-card p-4 border-b border-bg-neutral">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </>
  );
};

export default LessonHeader;