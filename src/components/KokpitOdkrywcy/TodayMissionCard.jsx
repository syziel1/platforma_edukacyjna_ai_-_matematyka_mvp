import React from 'react';
import { Clock, Video, Calendar } from 'lucide-react';

const TodayMissionCard = ({ timeRemaining, mentorSession, onScheduleMentor }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = 3600; // 1 godzina
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h2 className="text-2xl font-bold text-text-color mb-6 flex items-center gap-2">
        🎯 Twoja misja na dziś
      </h2>
      
      {/* Wskaźnik czasu */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-primary" />
            <span className="font-medium text-text-color">Pozostały czas nauki:</span>
          </div>
          <span className="text-2xl font-bold text-accent-primary">
            {formatTime(timeRemaining)}
          </span>
        </div>
        
        {/* Circular progress bar */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#FFA500"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - getProgressPercentage() / 100)}`}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-accent-primary">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
        </div>
      </div>

      {/* Cel dnia */}
      <div className="mb-6 p-4 bg-accent-secondary/10 rounded-lg border border-accent-secondary/30">
        <p className="text-text-color font-medium">
          <strong>Cel:</strong> Opanowanie podstaw funkcji kwadratowej i jej zastosowań.
        </p>
      </div>

      {/* Sekcja mentora */}
      <div className="border-t border-bg-neutral pt-4">
        {!mentorSession ? (
          <div className="text-center">
            <div className="mb-3">
              <Calendar className="w-8 h-8 text-nav-bg mx-auto mb-2" />
              <p className="text-text-color/70 text-sm">
                Potrzebujesz pomocy? Umów się z mentorem!
              </p>
            </div>
            <button
              onClick={onScheduleMentor}
              className="w-full bg-nav-bg text-white py-3 px-6 rounded-lg hover:bg-nav-bg/90 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              UMÓW SESJĘ Z MENTOREM
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-3">
              <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-text-color font-medium">
                Spotkanie z mentorem: {mentorSession.name}
              </p>
              <p className="text-text-color/70 text-sm">
                {mentorSession.date} o {mentorSession.time}
              </p>
            </div>
            <a
              href={mentorSession.zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 inline-flex"
            >
              <Video className="w-5 h-5" />
              DOŁĄCZ DO SPOTKANIA
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayMissionCard;