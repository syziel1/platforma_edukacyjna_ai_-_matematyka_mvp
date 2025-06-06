import React from 'react';

const WelcomeModal = ({ selectedMode, gameModeConfig, onStart }) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{getModeIcon(selectedMode)}</div>
          <h2 className={`text-3xl font-bold mb-2 ${getModeColor(selectedMode)}`}>
            Witaj w Dżungli {modeInfo?.name}!
          </h2>
          <p className="text-gray-600 text-lg">
            Przygotuj się na przygodę matematyczną z działaniami {modeInfo?.name.toLowerCase()}!
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-center">
            🎯 Przykładowe zadania w tym trybie:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {getExamples(selectedMode)}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-text-color mb-2">Instrukcja:</h4>
          <ul className="space-y-2 text-text-color/70">
            <li>
              Poruszaj się po planszy za pomocą klawiszy strzałek:
              <ul className="ml-4 mt-1 space-y-1">
                <li><strong>Strzałka w górę:</strong> Idź do przodu</li>
                <li><strong>Strzałka w lewo:</strong> Obróć się w lewo</li>
                <li><strong>Strzałka w prawo:</strong> Obróć się w prawo</li>
              </ul>
            </li>
            <li>Aby wejść na nowe, zarośnięte pole, musisz poprawnie rozwiązać działanie {modeInfo?.name.toLowerCase()}.</li>
            <li>Poprawna odpowiedź zmniejsza trawę, błędna ją zwiększa.</li>
            <li>Pola z piaskiem są już odkryte - możesz na nie wchodzić swobodnie.</li>
            <li>Odkrywaj kolejne poziomy, usuwając trawę i zdobywając punkty!</li>
            <li>Szukaj ukrytych bonusów i ciekawostek od Ducha Dżungli!</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className={`w-full text-white py-3 px-6 rounded-md transition-colors text-lg font-medium ${
            selectedMode === 'addition' ? 'bg-green-500 hover:bg-green-600' :
            selectedMode === 'subtraction' ? 'bg-red-500 hover:bg-red-600' :
            selectedMode === 'multiplication' ? 'bg-blue-500 hover:bg-blue-600' :
            selectedMode === 'division' ? 'bg-purple-500 hover:bg-purple-600' :
            selectedMode === 'exponentiation' ? 'bg-yellow-500 hover:bg-yellow-600' :
            selectedMode === 'square-root' ? 'bg-orange-500 hover:bg-orange-600' :
            'bg-accent-primary hover:bg-accent-primary/90'
          }`}
        >
          🚀 Rozpocznij przygodę z {modeInfo?.name.toLowerCase()}!
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;