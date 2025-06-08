import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import Badge from './Badge';

const AchievementsWidget = ({ recentBadges, totalBadgeCount }) => {
  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h4 className="text-lg font-bold text-text-color mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-accent-secondary" />
        Ostatnie Osiągnięcia
      </h4>
      
      {/* Kontener odznak */}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-2 mb-3">
          {recentBadges.slice(0, 4).map((badge) => (
            <Badge 
              key={badge.id}
              iconUrl={badge.iconUrl}
              name={badge.name}
            />
          ))}
        </div>
      </div>

      {/* Link do wszystkich odznak */}
      <button className="w-full text-nav-bg hover:text-nav-bg/80 transition-colors font-medium text-sm flex items-center justify-center gap-2 py-2 border border-nav-bg/30 rounded-lg hover:bg-nav-bg/5">
        Zobacz wszystkie ({totalBadgeCount})
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AchievementsWidget;