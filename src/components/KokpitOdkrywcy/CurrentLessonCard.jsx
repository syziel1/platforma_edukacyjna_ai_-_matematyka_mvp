import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

const CurrentLessonCard = ({ lesson, onContinueLesson }) => {
  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h2 className="text-xl font-bold text-text-color mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-accent-primary" />
        {lesson.title}
      </h2>
      
      {/* Grafika lekcji */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <img 
          src={lesson.graphic}
          alt="Wizualizacja problemu"
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Pasek postępu */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-color">Postęp:</span>
          <span className="text-sm font-bold text-accent-primary">
            {Math.round(lesson.progress)}%
          </span>
        </div>
        <div className="w-full bg-bg-neutral rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-500 ease-out"
            style={{ width: `${lesson.progress}%` }}
          />
        </div>
      </div>

      {/* Aktualny krok */}
      <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 font-medium text-sm">
          <strong>Aktualny etap:</strong> {lesson.currentStep}
        </p>
      </div>

      {/* Przycisk kontynuacji */}
      <button
        onClick={onContinueLesson}
        className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white py-4 px-6 rounded-lg hover:from-accent-primary/90 hover:to-accent-secondary/90 transition-all duration-200 font-bold text-lg flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
      >
        KONTYNUUJ NAUKĘ
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CurrentLessonCard;