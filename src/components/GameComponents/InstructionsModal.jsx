import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const InstructionsModal = ({ selectedMode, gameModeConfig, onBack, onStart }) => {
  const { translate } = useLanguage();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="text-3xl md:text-4xl mb-3">{getModeIcon(selectedMode)}</div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
            {translate('gameInstructions', { operation: modeInfo?.name })}
          </h2>
        </div>

        <div className="space-y-4 mb-6 text-sm md:text-base">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎮 {translate('controls')}</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="mb-2">{translate('controlsDesc')}</p>
              <ul className="ml-4 space-y-1 text-gray-700">
                <li><strong>⬆️</strong> {translate('arrowUp')}</li>
                <li><strong>⬅️</strong> {translate('arrowLeft')}</li>
                <li><strong>➡️</strong> {translate('arrowRight')}</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🌱 {translate('gameRules')}</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-gray-700">
              <p>• {translate('solveToMove', { operation: modeInfo?.name.toLowerCase() })}</p>
              <p>• <span className="text-green-600 font-medium">{translate('correctAnswer')}</span></p>
              <p>• <span className="text-red-600 font-medium">{translate('wrongAnswer')}</span></p>
              <p>• {translate('clearedFields')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🏆 {translate('gameGoal')}</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-gray-700">
              <p>• {translate('discoverLevels')}</p>
              <p>• {translate('findBonuses')}</p>
              <p>• {translate('practiceOperations', { operation: modeInfo?.name.toLowerCase() })}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            className={`w-full text-white py-3 px-6 rounded-md transition-colors text-lg font-medium ${getButtonColor(selectedMode)}`}
          >
            🚀 {translate('startGame')}
          </button>
          
          <button
            onClick={onBack}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-colors text-base font-medium"
          >
            ⬅️ {translate('back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;