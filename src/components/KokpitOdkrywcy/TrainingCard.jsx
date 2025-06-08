import React from 'react';
import { Gamepad2, Trophy, ArrowRight } from 'lucide-react';

const TrainingCard = ({ bestScore, onStartGame }) => {
  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h3 className="text-lg font-bold text-text-color mb-4 flex items-center gap-2">
        <Gamepad2 className="w-5 h-5 text-accent-primary" />
        Trening: Mistrz Mnożenia
      </h3>
      
      {/* Grafika gry */}
      <div className="mb-4 relative rounded-lg overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 h-24 flex items-center justify-center">
        <div className="text-4xl">🌴</div>
        <div className="absolute top-2 right-2 text-2xl">🧮</div>
        <div className="absolute bottom-2 left-2 text-xl">⚡</div>
      </div>

      {/* Rekord */}
      <div className="mb-4 p-3 bg-accent-secondary/10 rounded-lg border border-accent-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent-secondary" />
          <span className="text-text-color font-medium text-sm">Twój rekord:</span>
        </div>
        <span className="text-accent-secondary font-bold text-lg">
          {bestScore.toLocaleString()}
        </span>
      </div>

      {/* Przycisk */}
      <button
        onClick={onStartGame}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
      >
        ZAGRAJ
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TrainingCard;