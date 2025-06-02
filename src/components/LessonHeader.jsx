import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import BreakTimer from './BreakTimer';
import { useLanguage } from '../contexts/LanguageContext';
import { Video } from 'lucide-react'; // Import Video icon

const LessonHeader = ({ currentStep, totalSteps }) => {
  const { translate } = useLanguage();

  const handleVideoCall = () => {
    // Placeholder action for video call
    alert('Symulacja połączenia wideo z mentorem!');
    // W rzeczywistej aplikacji tutaj byłaby logika inicjująca połączenie wideo
  };

  return (
    <div className="bg-bg-card shadow-sm border-b border-bg-neutral p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-text-color">
          {translate('lessonTitle')}
        </h1>
        {/* Right-aligned items: Break Timer and Video Call */}
        <div className="flex items-center gap-4"> {/* Container for grouping right items */}
          <BreakTimer />
          {/* Video Call Button */}
          <button
            onClick={handleVideoCall}
            className="flex items-center gap-2 text-text-color hover:text-accent-primary transition-colors p-2 rounded-md hover:bg-bg-neutral" // Added padding and hover background for better click area
            title="Połącz się wideo z mentorem" // Tooltip
          >
            <Video className="w-5 h-5" />
            {/* Można dodać tekst "Mentor" obok ikony, jeśli jest miejsce */}
            {/* <span className="text-sm">Mentor</span> */}
          </button>
        </div>
      </div>
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  );
};

export default LessonHeader;