import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import GlobalHeader from './GlobalHeader';
import { useLanguage } from '../contexts/LanguageContext';

const LessonHeader = ({ currentStep, totalSteps, onBack, title }) => {
  const { t } = useLanguage();

  return (
    <>
      <GlobalHeader 
        title={title || t('lessonTitle')}
        onBack={onBack}
        showBackButton={true}
      />
      <div className="bg-bg-card p-4 border-b border-bg-neutral">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </>
  );
};

export default LessonHeader;