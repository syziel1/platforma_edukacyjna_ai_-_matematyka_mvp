import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Modal from '../Modal';

const InstructionsModal = ({ selectedMode, gameModeConfig, onBack, onStart, onCancel }) => {
  const { t } = useLanguage();
  const modeInfo = gameModeConfig[selectedMode];
  
  const getModeIcon = (mode) => {
    switch(mode) {
      case 'addition': return '➕';
      case 'subtraction': return '➖';
      case 'multiplication': return '✖️';
      case 'division': return '➗';
      case 'exponentiation': return '⚡';
      case 'square-root': return '√';
      default: return '🧮';
    }
  };

  const getButtonColor = (mode) => {
    switch(mode) {
      case 'addition': return 'bg-green-500 hover:bg-green-600';
      case 'subtraction': return 'bg-red-500 hover:bg-red-600';
      case 'multiplication': return 'bg-blue-500 hover:bg-blue-600';
      case 'division': return 'bg-purple-500 hover:bg-purple-600';
      case 'exponentiation': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'square-root': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-accent-primary hover:bg-accent-primary/90';
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      size="large"
      closeOnEscape={true}
    >
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="text-3xl md:text-4xl mb-3">{getModeIcon(selectedMode)}</div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
            {t('gameInstructions', { operation: modeInfo?.name })}
          </h2>
        </div>

        <div className="space-y-4 mb-6 text-sm md:text-base">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎮 {t('controls')}</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="mb-2">{t('controlsDesc')}</p>
              <ul className="ml-4 space-y-1 text-gray-700">
                <li><strong>⬆️</strong> {t('arrowUp')}</li>
                <li><strong>⬅️</strong> {t('arrowLeft')}</li>
                <li><strong>➡️</strong> {t('arrowRight')}</li>
                <li><strong>ESC</strong> Exit game or close dialogs</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🌱 {t('gameRules')}</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-gray-700">
              <p>• {t('solveToMove', { operation: modeInfo?.name.toLowerCase() })}</p>
              <p>• <span className="text-green-600 font-medium">{t('correctAnswer')}</span></p>
              <p>• <span className="text-red-600 font-medium">{t('wrongAnswer')}</span></p>
              <p>• {t('clearedFields')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🏆 {t('gameGoal')}</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-gray-700">
              <p>• {t('discoverLevels')}</p>
              <p>• {t('findBonuses')}</p>
              <p>• {t('practiceOperations', { operation: modeInfo?.name.toLowerCase() })}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            className={`w-full text-white py-3 px-6 rounded-md transition-colors text-lg font-medium ${getButtonColor(selectedMode)}`}
          >
            🚀 {t('startGame')}
          </button>
          
          <button
            onClick={onBack}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-colors text-base font-medium"
          >
            ⬅️ {t('back')}
          </button>
        </div>

        {/* ESC hint */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Press ESC to go back
        </div>
      </div>
    </Modal>
  );
};

export default InstructionsModal;