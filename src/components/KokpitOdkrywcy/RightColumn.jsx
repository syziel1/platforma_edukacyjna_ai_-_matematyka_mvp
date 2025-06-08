import React from 'react';
import KnowledgeMapCard from './KnowledgeMapCard';
import TrainingCard from './TrainingCard';
import AchievementsWidget from './AchievementsWidget';

const RightColumn = ({ 
  bestScore, 
  recentBadges, 
  totalBadgeCount, 
  onStartGame, 
  onOpenKnowledgeMap 
}) => {
  return (
    <div className="space-y-6">
      <KnowledgeMapCard onOpenKnowledgeMap={onOpenKnowledgeMap} />
      <TrainingCard bestScore={bestScore} onStartGame={onStartGame} />
      <AchievementsWidget 
        recentBadges={recentBadges}
        totalBadgeCount={totalBadgeCount}
      />
    </div>
  );
};

export default RightColumn;