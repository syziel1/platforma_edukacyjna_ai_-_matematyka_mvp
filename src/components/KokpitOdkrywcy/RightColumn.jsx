import React from 'react';
import KnowledgeMapCard from './KnowledgeMapCard';
import TrainingCard from './TrainingCard';
import AchievementsWidget from './AchievementsWidget';

const RightColumn = ({ 
  onStartGame, 
  onOpenKnowledgeMap 
}) => {
  return (
    <div className="space-y-6">
      <KnowledgeMapCard onOpenKnowledgeMap={onOpenKnowledgeMap} />
      <TrainingCard onStartGame={onStartGame} />
      <AchievementsWidget />
    </div>
  );
};

export default RightColumn;