import React from 'react';
import { Clock, Coffee } from 'lucide-react';
import { useBreakTimer } from '../hooks/useBreakTimer';
import { useLanguage } from '../contexts/LanguageContext';

const BreakTimer = () => {
  const { formattedTime, showBreakAlert, resetTimer, setShowBreakAlert } = useBreakTimer(25);
  const { t } = useLanguage();

  const handleBreakClick = () => {
    alert(t('breakSuggestions'));
  };

  const handleCloseAlert = () => {
    setShowBreakAlert(false);
    resetTimer();
  };

  return (
    <>
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-bg-neutral p-2 rounded-md transition-colors"
        onClick={handleBreakClick}
        title={t('breakSuggestions')}
      >
        <Clock className="w-4 h-4 text-text-color" />
        <span className="text-sm text-text-color">
          {t('nextBreak')} {formattedTime}
        </span>
      </div>

      {showBreakAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <Coffee className="w-6 h-6 text-accent-primary" />
              <h3 className="text-lg font-semibold text-text-color">Czas na przerwę!</h3>
            </div>
            <p className="text-text-color mb-6 whitespace-pre-line">
              {t('breakSuggestions')}
            </p>
            <button
              onClick={handleCloseAlert}
              className="w-full bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-primary/90 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BreakTimer;