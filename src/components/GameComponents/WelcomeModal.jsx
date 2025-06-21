import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Modal from '../Modal';

const WelcomeModal = ({ selectedMode, gameModeConfig, onStart, onShowInstructions, onCancel }) => {
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

  const getModeColor = (mode) => {
    switch(mode) {
      case 'addition': return 'text-green-600';
      case 'subtraction': return 'text-red-600';
      case 'multiplication': return 'text-blue-600';
      case 'division': return 'text-purple-600';
      case 'exponentiation': return 'text-yellow-600';
      case 'square-root': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getExamples = (mode) => {
    switch(mode) {
      case 'addition':
        return [
          <div key="1" className="bg-white p-3 rounded text-center font-mono text-lg">2 + 3 = ?</div>,
          <div key="2" className="bg-white p-3 rounded text-center font-mono text-lg">5 + 4 = ?</div>
        ];
      case 'subtraction':
        return [
          <div key="1" className="bg-white p-3 rounded text-center font-mono text-lg">8 - 3 = ?</div>,
          <div key="2" className="bg-white p-3 rounded text-center font-mono text-lg">12 - 5 = ?</div>
        ];
      case 'multiplication':
        return [
          <div key="1" className="bg-white p-3 rounded text-center font-mono text-lg">3 × 4 = ?</div>,
          <div key="2" className="bg-white p-3 rounded text-center font-mono text-lg">6 × 2 = ?</div>
        ];
      case 'division':
        return [
          <div key="1" className="bg-white p-3 rounded text-center font-mono text-lg">12 ÷ 3 = ?</div>,
          <div key="2" className="bg-white p-3 rounded text-center font-mono text-lg">20 ÷ 4 = ?</div>
        ];
      case 'exponentiation':
        return [
          <div key="1" className="bg-white p-3 rounded text-center font-mono text-lg">2³ = ?</div>,
          <div key="2" className="bg-white p-3 rounded text-center font-mono text-lg">3² = ?</div>
        ];
      case 'square-root':
        return [
          <div key="1" className="bg-white p-3 rounded text-center font-mono text-lg">√16 = ?</div>,
          <div key="2" className="bg-white p-3 rounded text-center font-mono text-lg">√25 = ?</div>
        ];
      default:
        return [];
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
          <div className="text-4xl md:text-6xl mb-4">{getModeIcon(selectedMode)}</div>
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${getModeColor(selectedMode)}`}>
            {t('welcomeToJungle', { operation: modeInfo?.name })}
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            {t('mathAdventure', { operation: modeInfo?.name.toLowerCase() })}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-center text-sm md:text-base">
            🎯 {t('exampleTasks')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getExamples(selectedMode)}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            className={`w-full text-white py-3 px-6 rounded-md transition-colors text-lg font-medium ${getButtonColor(selectedMode)}`}
          >
            🚀 {t('startAdventure', { operation: modeInfo?.name.toLowerCase() })}
          </button>
          
          <button
            onClick={onShowInstructions}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-colors text-base font-medium"
          >
            📖 {t('showInstructions')}
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

export default WelcomeModal;