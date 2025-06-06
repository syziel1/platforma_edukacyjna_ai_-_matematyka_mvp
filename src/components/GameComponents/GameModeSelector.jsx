import React from 'react';
import { Calculator, Plus, Minus, X, Divide, Zap } from 'lucide-react';

const GameModeSelector = ({ onModeSelect }) => {
  const gameModes = [
    {
      id: 'addition',
      name: 'Dodawanie',
      icon: Plus,
      description: 'Ucz się dodawania liczb',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      example: '5 + 3 = ?'
    },
    {
      id: 'subtraction',
      name: 'Odejmowanie',
      icon: Minus,
      description: 'Ćwicz odejmowanie liczb',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      example: '8 - 3 = ?'
    },
    {
      id: 'multiplication',
      name: 'Mnożenie',
      icon: X,
      description: 'Opanuj tabliczkę mnożenia',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      example: '4 × 6 = ?'
    },
    {
      id: 'division',
      name: 'Dzielenie',
      icon: Divide,
      description: 'Naucz się dzielenia liczb',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      example: '12 ÷ 3 = ?'
    },
    {
      id: 'exponentiation',
      name: 'Potęgowanie',
      icon: Zap,
      description: 'Poznaj potęgi liczb',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      example: '2³ = ?'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-12 h-12 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">
              Wybierz rodzaj działań matematycznych
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Wybierz, które działania chcesz ćwiczyć w dżungli matematycznej!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              className={`${mode.color} ${mode.hoverColor} text-white p-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 group`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <mode.icon className="w-12 h-12 group-hover:animate-bounce" />
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {mode.name}
                </h3>
                
                <p className="text-white/90 text-sm mb-4">
                  {mode.description}
                </p>
                
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-lg font-mono font-bold">
                    {mode.example}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              💡 <strong>Wskazówka:</strong> Każdy tryb dostosowuje poziom trudności do Twojego wieku i umiejętności!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;