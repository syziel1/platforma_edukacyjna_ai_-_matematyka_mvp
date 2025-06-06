import React from 'react';

const InstructionsModal = ({ selectedMode, gameModeConfig, onBack, onStart }) => {
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
            Instrukcja gry - {modeInfo?.name}
          </h2>
        </div>

        <div className="space-y-4 mb-6 text-sm md:text-base">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎮 Sterowanie:</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="mb-2">Poruszaj się po planszy za pomocą klawiszy strzałek:</p>
              <ul className="ml-4 space-y-1 text-gray-700">
                <li><strong>⬆️ Strzałka w górę:</strong> Idź do przodu</li>
                <li><strong>⬅️ Strzałka w lewo:</strong> Obróć się w lewo</li>
                <li><strong>➡️ Strzałka w prawo:</strong> Obróć się w prawo</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🌱 Zasady gry:</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-gray-700">
              <p>• Aby wejść na nowe, zarośnięte pole, musisz poprawnie rozwiązać działanie {modeInfo?.name.toLowerCase()}.</p>
              <p>• <span className="text-green-600 font-medium">Poprawna odpowiedź</span> zmniejsza trawę i pozwala przejść dalej.</p>
              <p>• <span className="text-red-600 font-medium">Błędna odpowiedź</span> zwiększa trawę, utrudniając przejście.</p>
              <p>• Pola z piaskiem są już odkryte - możesz na nie wchodzić swobodnie.</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🏆 Cel gry:</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-gray-700">
              <p>• Odkrywaj kolejne poziomy, usuwając trawę i zdobywając punkty!</p>
              <p>• Szukaj ukrytych bonusów 💎 - dają dodatkowe punkty!</p>
              <p>• Ćwicz działania {modeInfo?.name.toLowerCase()} w przyjemnej formie gry!</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onStart}
            className={`w-full text-white py-3 px-6 rounded-md transition-colors text-lg font-medium ${getButtonColor(selectedMode)}`}
          >
            🚀 Rozpocznij grę!
          </button>
          
          <button
            onClick={onBack}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition-colors text-base font-medium"
          >
            ⬅️ Powrót
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;