import React from 'react';
import { Clock, Coffee } from 'lucide-react';
import { useBreakTimer } from '../hooks/useBreakTimer';
import { useGlobalTimer } from '../hooks/useGlobalTimer';
import { useLanguage } from '../contexts/LanguageContext';

const BreakTimer = () => {
  const { formattedTime, showBreakAlert, resetTimer, setShowBreakAlert, handleBreakTaken } = useBreakTimer(25);
  const { resetAfterBreak } = useGlobalTimer();
  const { t } = useLanguage();

  const handleBreakClick = () => {
    alert(t('breakSuggestions'));
  };

  const handleCloseAlert = () => {
    setShowBreakAlert(false);
    // Reset zarówno timer przerwy jak i timer globalny
    handleBreakTaken(resetAfterBreak);
  };

  const handleTakeBreakNow = () => {
    // Użytkownik decyduje się na przerwę teraz
    handleBreakTaken(resetAfterBreak);
    alert('Timer został zresetowany po przerwie! 🔄');
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

      {/* Dodatkowy przycisk do manualnego wzięcia przerwy */}
      <button
        onClick={handleTakeBreakNow}
        className="text-xs text-text-color/70 hover:text-text-color transition-colors p-1 rounded"
        title="Weź przerwę teraz i zresetuj timer"
      >
        ☕ Przerwa teraz
      </button>

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
            <div className="space-y-3">
              <button
                onClick={handleCloseAlert}
                className="w-full bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-primary/90 transition-colors"
              >
                ✅ Wziąłem przerwę - resetuj timer
              </button>
              <button
                onClick={() => setShowBreakAlert(false)}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                ⏰ Jeszcze 5 minut
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BreakTimer;