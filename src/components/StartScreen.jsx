import React from 'react';
import { BookOpen, Star, Trophy, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const StartScreen = ({ onProblemSelect }) => {
  const { translate } = useLanguage();

  const problems = [
    {
      id: 'chicken-coop',
      title: translate('chickenCoopTitle'),
      description: translate('chickenCoopDesc'),
      difficulty: 'easy',
      icon: Star,
      color: 'accent-primary'
    },
    {
      id: 'garden-fence',
      title: translate('gardenFenceTitle'),
      description: translate('gardenFenceDesc'),
      difficulty: 'medium',
      icon: Zap,
      color: 'accent-secondary'
    },
    {
      id: 'water-tank',
      title: translate('waterTankTitle'),
      description: translate('waterTankDesc'),
      difficulty: 'hard',
      icon: Trophy,
      color: 'nav-bg'
    }
  ];

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-color mb-2">
          {translate('welcomeTitle')}
        </h1>
        <p className="text-text-color/70">
          {translate('welcomeDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {problems.map((problem) => (
          <button
            key={problem.id}
            onClick={() => onProblemSelect(problem.id)}
            className="bg-bg-card p-6 rounded-lg shadow-sm border border-bg-neutral hover:border-nav-bg/50 transition-all text-left"
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
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-text-color/70" />
              <span className="text-xs text-text-color/70">
                {translate('startLesson')}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StartScreen;