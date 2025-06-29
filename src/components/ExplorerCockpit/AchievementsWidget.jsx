import React from 'react';
import { Award, ArrowRight, Calendar, Siren as Fire } from 'lucide-react';
import { useGameRecords } from '../../contexts/GameRecordsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Badge from './Badge';

const AchievementsWidget = () => {
  const { getRecentAchievements, getAllAchievements, getCurrentStreak, getBestStreak } = useGameRecords();
  const { t } = useLanguage();
  const recentBadges = getRecentAchievements(4);
  const totalBadgeCount = getAllAchievements().length;
  const currentStreak = getCurrentStreak();
  const bestStreak = getBestStreak();

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h4 className="text-lg font-bold text-text-color mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-accent-secondary" />
        {t('recentAchievements')} ({totalBadgeCount})
      </h4>
      
      {/* Learning streak display */}
      <div className="mb-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fire className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
            <span className="font-medium text-text-color">{t('learningStreak')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`text-xl font-bold ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
              {currentStreak}
            </span>
            <span className="text-sm text-text-color/70">{t('days')}</span>
          </div>
        </div>
        
        {bestStreak > 0 && (
          <div className="mt-2 text-xs text-text-color/70 flex justify-between">
            <span>{t('bestStreak')}</span>
            <span className="font-medium">{bestStreak} {t('days')}</span>
          </div>
        )}
        
        {currentStreak === 0 ? (
          <p className="mt-2 text-xs text-text-color/70">
            {t('startLearningStreak')}
          </p>
        ) : currentStreak < 3 ? (
          <p className="mt-2 text-xs text-orange-600">
            {t('streakAchievement3', { days: 3 - currentStreak })}
          </p>
        ) : currentStreak < 5 ? (
          <p className="mt-2 text-xs text-orange-600">
            {t('streakAchievement5', { days: 5 - currentStreak })}
          </p>
        ) : currentStreak < 7 ? (
          <p className="mt-2 text-xs text-orange-600">
            {t('streakAchievement7', { days: 7 - currentStreak })}
          </p>
        ) : (
          <p className="mt-2 text-xs text-orange-600">
            {t('keepStreak')}
          </p>
        )}
      </div>
      
      {/* Badges container */}
      <div className="mb-4">
        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-5 gap-2 mb-3">
            {recentBadges.reverse().map((badge) => (
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
            <p className="text-sm">{t('playGamesEarnAchievements')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsWidget;