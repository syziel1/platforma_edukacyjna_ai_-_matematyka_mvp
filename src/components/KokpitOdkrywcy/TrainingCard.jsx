import React from 'react';
import { Gamepad2, Trophy, ArrowRight } from 'lucide-react';
import { useGameRecords } from '../../contexts/GameRecordsContext';

const TrainingCard = ({ onStartGame }) => {
  const { records } = useGameRecords();
  const bestScore = records.multiplicationGame.bestScore;
  const totalGames = records.multiplicationGame.totalGamesPlayed;
  const averageScore = records.multiplicationGame.averageScore;

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h3 className="text-lg font-bold text-text-color mb-4 flex items-center gap-2">
        <Gamepad2 className="w-5 h-5 text-accent-primary" />
        Training: Mathematical Jungle
      </h3>
      
      {/* Video gry */}
      <div className="mb-4 relative rounded-lg overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
        <video 
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/videos/math_jungle-poster.jpg"
        >
          <source src="/videos/math_jungle.mp4" type="video/mp4" />
          {/* Fallback content when video fails to load */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <div className="text-4xl">🌴</div>
            <div className="absolute top-2 right-2 text-2xl">🧮</div>
            <div className="absolute bottom-2 left-2 text-xl">⚡</div>
          </div>
        </video>
        
        {/* Overlay with game elements (visible over video) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-4xl drop-shadow-lg">🌴</div>
        </div>
        <div className="absolute top-2 right-2 text-2xl drop-shadow-lg pointer-events-none">🧮</div>
        <div className="absolute bottom-2 left-2 text-xl drop-shadow-lg pointer-events-none">⚡</div>
      </div>

      {/* Statystyki gracza */}
      <div className="mb-4 space-y-2">
        {/* Rekord */}
        <div className="p-3 bg-accent-secondary/10 rounded-lg border border-accent-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent-secondary" />
            <span className="text-text-color font-medium text-sm">Your record:</span>
          </div>
          <span className="text-accent-secondary font-bold text-lg">
            {bestScore > 0 ? bestScore.toLocaleString() : '---'}
          </span>
        </div>

        {/* Dodatkowe statystyki jeśli gracz już grał */}
        {totalGames > 0 && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded border border-blue-200 text-center">
              <div className="text-blue-600 font-medium">Games played</div>
              <div className="text-blue-800 font-bold">{totalGames}</div>
            </div>
            <div className="bg-green-50 p-2 rounded border border-green-200 text-center">
              <div className="text-green-600 font-medium">Average score</div>
              <div className="text-green-800 font-bold">{averageScore}</div>
            </div>
          </div>
        )}
      </div>

      {/* Przycisk */}
      <button
        onClick={onStartGame}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
      >
        {totalGames > 0 ? 'PLAY AGAIN' : 'PLAY'}
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Motywacyjny tekst */}
      {bestScore > 0 && (
        <div className="mt-3 text-center">
          <p className="text-xs text-text-color/70">
            {bestScore < 1000 ? '🎯 Goal: 1000 points!' : 
             bestScore < 2000 ? '🌟 Goal: 2000 points!' : 
             bestScore < 5000 ? '👑 Goal: 5000 points!' : 
             '🏆 You are a master!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrainingCard;