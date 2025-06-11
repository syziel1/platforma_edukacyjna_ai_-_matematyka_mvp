import React from 'react';
import TrainingCard from './TrainingCard';
import TodayMissionCard from './TodayMissionCard';
import CurrentLessonCard from './CurrentLessonCard';

const LeftColumn = ({ 
  mentorSession, 
  currentLesson, 
  onScheduleMentor, 
  onContinueLesson 
}) => {
  return (
    <div className="space-y-6">
      <TrainingCard onStartGame={onStartGame} />
      <TodayMissionCard 
        mentorSession={mentorSession}
        onScheduleMentor={onScheduleMentor}
      />
      <CurrentLessonCard 
        lesson={currentLesson}
        onContinueLesson={onContinueLesson}
      />
    </div>
  );
};

export default LeftColumn;