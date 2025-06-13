import React from 'react';
import { BookOpen, Star, Trophy, Zap, Calculator, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import GlobalHeader from './GlobalHeader';

const StartScreen = ({ onProblemSelect }) => {
  const { t } = useLanguage();
  const { getProgress } = useProgress();

  const problems = [
    {
      id: 'jungle-game',
      title: t('jungleGameTitle'),
      description: t('jungleGameDesc'),
      difficulty: 'medium',
      icon: Calculator,
      color: 'accent-secondary',
      totalSteps: 1
    },
    {
      id: 'chicken-coop',
      title: t('chickenCoopTitle'),
      description: t('chickenCoopDesc'),
      difficulty: 'easy',
      icon: Star,
      color: 'accent-primary',
      totalSteps: 5
    },
    {
      id: 'eco-tshirt',
      title: t('ecoTshirtTitle'),
      description: t('ecoTshirtDesc'),
      difficulty: 'medium',
      icon: TrendingUp,
      color: 'nav-bg',
      totalSteps: 5
    },
    {
      id: 'water-tank',
      title: t('waterTankTitle'),
      description: t('waterTankDesc'),
      difficulty: 'hard',
      icon: Trophy,
      color: 'nav-bg',
      totalSteps: 5
    },
    {
      id: 'powers-roots',
      title: 'Powers & Roots',
      description: 'Interaktywne wzory i definicje.',
      icon: Zap,
      color: 'accent-primary',
      totalSteps: 1
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <GlobalHeader 
        title={t('welcomeTitle')}
        showBackButton={false}
      />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <p className="text-text-color/70">
            {t('welcomeDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem) => {
            const currentProgress = getProgress(problem.id);
            const progressPercentage = (currentProgress / problem.totalSteps) * 100;

            return (
              <button
                key={problem.id}
                onClick={() => onProblemSelect(problem.id)}
                className="bg-bg-card p-6 rounded-lg shadow-sm border border-bg-neutral hover:border-nav-bg/50 transition-all text-left relative"
              >
                <div className={`w-10 h-10 rounded-full bg-${problem.color}/10 flex items-center justify-center mb-4`}>
                  <problem.icon className={`w-5 h-5 text-${problem.color}`} />
                </div>
                <h3 className="font-semibold text-text-color mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-text-color/70 mb-4">
                  {problem.description}
                </p>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="bg-bg-neutral rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-${problem.color} transition-all duration-300`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-text-color/70" />
                      <span className="text-xs text-text-color/70">
                        {currentProgress > 0 
                          ? t('continueLesson')
                          : t('startLesson')}
                      </span>
                    </div>
                    <span className="text-xs text-text-color/70">
                      {currentProgress > 0 && `${currentProgress}/${problem.totalSteps}`}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;