import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import BreakTimer from './BreakTimer';
import { useLanguage } from '../contexts/LanguageContext';
import { Video, ArrowLeft } from 'lucide-react';

const LessonHeader = ({ currentStep, totalSteps, onBack, title }) => {
  const { translate } = useLanguage();

  const handleVideoCall = () => {
    alert('Symulacja połączenia wideo z mentorem!');
  };

  return (
    <div className="bg-bg-card shadow-sm border-b border-bg-neutral p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-text-color hover:text-accent-primary transition-colors"
            title={translate('backToProblems')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-text-color">
            {title || translate('lessonTitle')}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <BreakTimer />
          <button
            onClick={handleVideoCall}
            className="flex items-center gap-2 text-text-color hover:text-accent-primary transition-colors p-2 rounded-md hover:bg-bg-neutral"
            title={translate('connectWithMentor')}
          >
            <Video className="w-5 h-5" />
          </button>
        </div>
      </div>
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  );
};

export default LessonHeader;