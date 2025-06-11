import React from 'react';
import { Video, ArrowLeft, Clock, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGlobalTimer } from '../hooks/useGlobalTimer';
import { useMentorStatus } from '../hooks/useMentorStatus';

const GlobalHeader = ({ title, onBack, showBackButton = false }) => {
  const { t } = useLanguage();
  const { formattedTime } = useGlobalTimer();
  const { status, getStatusColor, getStatusIcon, getStatusText, formatNextAvailability } = useMentorStatus();

  const handleVideoCall = () => {
    if (status === 'available') {
      window.open('http://strefaedukacji.zrozoomai.pl/', '_blank');
    } else {
      const nextAvail = formatNextAvailability(t);
      alert(`${t('mentorNotAvailable')} ${nextAvail ? `\n${t('nextAvailability')}: ${nextAvail}` : ''}`);
    }
  };

  return (
    <div className="bg-bg-card shadow-sm border-b border-bg-neutral p-2 md:p-4 sticky top-0 z-10">
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

        {/* Right side - Timer and Mentor status */}
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

          {/* Mentor Status */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handleVideoCall}
              className={`flex items-center gap-1 md:gap-2 p-1 md:p-2 rounded-md transition-all duration-200 ${
                status === 'available' 
                  ? 'hover:bg-green-50 hover:scale-105' 
                  : 'hover:bg-gray-50 cursor-not-allowed opacity-75'
              }`}
              title={`${getStatusText(t)} ${formatNextAvailability(t) ? `- ${t('nextAvailability')}: ${formatNextAvailability(t)}` : ''}`}
            >
              <div className="relative">
                <Video className={`w-3 h-3 md:w-5 md:h-5 ${getStatusColor()}`} />
                {/* Status indicator */}
                <div className="absolute bottom-0 -right-0.5 text-xs">
                  {getStatusIcon()}
                </div>
                {/* Busy indicator */}
                {status === 'busy' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full animate-pulse" />
                )}
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-xs text-text-color/70">
                  {t('mentor')}
                </span>
                <span className={`text-xs font-medium ${getStatusColor()}`}>
                  {getStatusText(t)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalHeader;