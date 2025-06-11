import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { useGameRecords } from '../../contexts/GameRecordsContext';
import Badge from './Badge';

const AchievementsWidget = () => {
  const { getRecentAchievements, getAllAchievements } = useGameRecords();
  const recentBadges = getRecentAchievements(4);
  const totalBadgeCount = getAllAchievements().length;

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h4 className="text-lg font-bold text-text-color mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-accent-secondary" />
        Recent Achievements ({totalBadgeCount})
      </h4>
      
      {/* Kontener odznak */}
      <div className="mb-4">
        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {recentBadges.map((badge) => (
              <Badge 
                key={badge.id}
                iconUrl={badge.icon}
                name={badge.name}
                description={badge.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-color/50">
            <Award className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Play games to earn your first achievements!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsWidget;