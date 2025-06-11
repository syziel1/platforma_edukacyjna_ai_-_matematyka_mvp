import React from 'react';
import TrainingCard from './TrainingCard';
import KnowledgeMapCard from './KnowledgeMapCard';
import AchievementsWidget from './AchievementsWidget';

const RightColumn = ({ 
  onStartGame, 
  onOpenKnowledgeMap 
}) => {
  return (
    <div className="space-y-6">
      <TrainingCard onStartGame={onStartGame} />
      <KnowledgeMapCard onOpenKnowledgeMap={onOpenKnowledgeMap} />
      <AchievementsWidget />
    </div>
  );
};

export default RightColumn;