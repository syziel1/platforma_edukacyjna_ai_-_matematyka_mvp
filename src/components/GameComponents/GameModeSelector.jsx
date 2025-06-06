import React from 'react';
import { Calculator, Plus, Minus, X, Divide, Zap, Square as SquareRoot, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const GameModeSelector = ({ onModeSelect, onCancel }) => {
  const { translate } = useLanguage();

  const gameModes = [
    {
      id: 'addition',
      name: translate('addition'),
      icon: Plus,
      description: translate('additionDesc'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      example: '5 + 3 = ?'
    },
    {
      id: 'subtraction',
      name: translate('subtraction'),
      icon: Minus,
      description: translate('subtractionDesc'),
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      example: '8 - 3 = ?'
    },
    {
      id: 'multiplication',
      name: translate('multiplication'),
      icon: X,
      description: translate('multiplicationDesc'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      example: '4 × 6 = ?'
    },
    {
      id: 'division',
      name: translate('division'),
      icon: Divide,
      description: translate('divisionDesc'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      example: '12 ÷ 3 = ?'
    },
    {
      id: 'exponentiation',
      name: translate('exponentiation'),
      icon: Zap,
      description: translate('exponentiationDesc'),
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      example: '2³ = ?'
    },
    {
      id: 'square-root',
      name: translate('squareRoot'),
      icon: SquareRoot,
      description: translate('squareRootDesc'),
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      example: '√16 = ?'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Mobile back button at the very top */}
        <div className="md:hidden mb-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100"
            title={translate('backToMenu')}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{translate('backToMenu')}</span>
          </button>
        </div>

        {/* Header with back button for desktop */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100"
            title={translate('backToMenu')}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{translate('backToMenu')}</span>
          </button>
          
          <div className="text-center flex-1">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-12 h-12 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">
                {translate('chooseMathOperations')}
              </h2>
            </div>
            <p className="text-gray-600 text-lg">
              {translate('chooseMathOperationsDesc')}
            </p>
          </div>
          
          {/* Spacer for balance */}
          <div className="w-20"></div>
        </div>

        {/* Mobile header without back button */}
        <div className="md:hidden text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 md:w-12 md:h-12 text-blue-600 mr-2 md:mr-3" />
            <h2 className="text-xl md:text-3xl font-bold text-gray-800">
              {translate('chooseMathOperations')}
            </h2>
          </div>
          <p className="text-gray-600 text-base md:text-lg">
            {translate('chooseMathOperationsDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              className={`${mode.color} ${mode.hoverColor} text-white p-4 md:p-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 group`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3 md:mb-4">
                  <mode.icon className="w-8 h-8 md:w-12 md:h-12 group-hover:animate-bounce" />
                </div>
                
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  {mode.name}
                </h3>
                
                <p className="text-white/90 text-xs md:text-sm mb-3 md:mb-4">
                  {mode.description}
                </p>
                
                <div className="bg-white/20 rounded-lg p-2 md:p-3 backdrop-blur-sm">
                  <div className="text-base md:text-lg font-mono font-bold">
                    {mode.example}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
            <p className="text-blue-800 text-xs md:text-sm">
              💡 <strong>{translate('tip')}</strong> {translate('difficultyTip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;