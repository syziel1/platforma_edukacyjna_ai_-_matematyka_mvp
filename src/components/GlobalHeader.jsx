import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';

const GlobalHeader = ({ title, onBack, showBackButton = false }) => {
  const { t } = useLanguage();
  const { formattedTime } = useGlobalTimer();

  return (
    <div className="fixed top-0 left-0 md:left-16 right-0 bg-bg-card shadow-sm border-b border-bg-neutral p-1 md:pl-4 z-30">
      <div className="flex items-center justify-between">
        {/* Left side - Back button and title */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="text-text-color hover:text-accent-primary transition-colors flex-shrink-0"
              title={t('backToProblems')}
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
          <h1 className="text-sm md:text-lg lg:text-xl font-bold text-text-color truncate">
            {title}
          </h1>
        </div>

        {/* Right side - Timer */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Global Timer */}
          <div className="flex items-center gap-1 md:gap-2 text-text-color">
            <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span className="text-xs md:text-sm font-medium hidden sm:inline">
              {t('sessionTime')}:
            </span>
            <span className="text-xs md:text-sm font-bold">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalHeader;