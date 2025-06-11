import React from 'react';
import KnowledgeMapCard from './KnowledgeMapCard';
import AchievementsWidget from './AchievementsWidget';

const RightColumn = ({ 
  onStartGame, 
  onOpenKnowledgeMap 
}) => {
  return (
    <div className="space-y-6">
      <KnowledgeMapCard onOpenKnowledgeMap={onOpenKnowledgeMap} />
      <AchievementsWidget />
    </div>
  );
};

export default RightColumn;