import React, { createContext, useContext, useState, useEffect } from 'react';

const GameRecordsContext = createContext();

export const useGameRecords = () => {
  const context = useContext(GameRecordsContext);
  if (!context) {
    throw new Error('useGameRecords must be used within a GameRecordsProvider');
  }
  return context;
};

export const GameRecordsProvider = ({ children }) => {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('gameRecords');
    return saved ? JSON.parse(saved) : {
      multiplicationGame: {
        bestScore: 0,
        totalGamesPlayed: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        lastPlayed: null,
        achievements: []
      },
      chickenCoop: {
        bestTime: null,
        completions: 0,
        lastCompleted: null
      },
      ecoTshirt: {
        bestProfit: null,
        completions: 0,
        lastCompleted: null
      },
      waterTank: {
        bestEfficiency: null,
        completions: 0,
        lastCompleted: null
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('gameRecords', JSON.stringify(records));
  }, [records]);

  const updateMultiplicationGameScore = (score, timeSpent) => {
    setRecords(prev => {
      const gameData = prev.multiplicationGame;
      const newBestScore = Math.max(gameData.bestScore, score);
      const newTotalGames = gameData.totalGamesPlayed + 1;
      const newTotalTime = gameData.totalTimeSpent + timeSpent;
      const newAverageScore = Math.round(
        ((gameData.averageScore * gameData.totalGamesPlayed) + score) / newTotalGames
      );

      // Check for achievements
      const newAchievements = [...gameData.achievements];
      
      // First game achievement
      if (newTotalGames === 1 && !newAchievements.includes('first-game')) {
        newAchievements.push('first-game');
      }
      
      // Score milestones
      if (score >= 1000 && !newAchievements.includes('score-1000')) {
        newAchievements.push('score-1000');
      }
      if (score >= 2000 && !newAchievements.includes('score-2000')) {
        newAchievements.push('score-2000');
      }
      if (score >= 5000 && !newAchievements.includes('score-5000')) {
        newAchievements.push('score-5000');
      }

      // Games played milestones
      if (newTotalGames >= 10 && !newAchievements.includes('games-10')) {
        newAchievements.push('games-10');
      }
      if (newTotalGames >= 50 && !newAchievements.includes('games-50')) {
        newAchievements.push('games-50');
      }

      return {
        ...prev,
        multiplicationGame: {
          bestScore: newBestScore,
          totalGamesPlayed: newTotalGames,
          totalTimeSpent: newTotalTime,
          averageScore: newAverageScore,
          lastPlayed: new Date().toISOString(),
          achievements: newAchievements
        }
      };
    });
  };

  const updateLessonCompletion = (lessonId, performance) => {
    setRecords(prev => {
      const lessonData = prev[lessonId] || { completions: 0 };
      
      return {
        ...prev,
        [lessonId]: {
          ...lessonData,
          completions: lessonData.completions + 1,
          lastCompleted: new Date().toISOString(),
          ...performance // bestTime, bestProfit, bestEfficiency, etc.
        }
      };
    });
  };

  const getAchievementInfo = (achievementId) => {
    const achievements = {
      'first-game': {
        name: 'Pierwszy Krok',
        description: 'Ukończ pierwszą grę',
        icon: '🎯'
      },
      'score-1000': {
        name: 'Tysiąc Punktów',
        description: 'Zdobądź 1000 punktów w jednej grze',
        icon: '🏆'
      },
      'score-2000': {
        name: 'Mistrz Matematyki',
        description: 'Zdobądź 2000 punktów w jednej grze',
        icon: '🌟'
      },
      'score-5000': {
        name: 'Legenda Dżungli',
        description: 'Zdobądź 5000 punktów w jednej grze',
        icon: '👑'
      },
      'games-10': {
        name: 'Wytrwały Odkrywca',
        description: 'Zagraj 10 gier',
        icon: '💪'
      },
      'games-50': {
        name: 'Weteran Dżungli',
        description: 'Zagraj 50 gier',
        icon: '🎖️'
      }
    };
    
    return achievements[achievementId] || { name: achievementId, description: '', icon: '🏅' };
  };

  const getAllAchievements = () => {
    return records.multiplicationGame.achievements.map(id => ({
      id,
      ...getAchievementInfo(id)
    }));
  };

  const getRecentAchievements = (limit = 4) => {
    return getAllAchievements().slice(-limit);
  };

  const resetRecords = () => {
    setRecords({
      multiplicationGame: {
        bestScore: 0,
        totalGamesPlayed: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        lastPlayed: null,
        achievements: []
      },
      chickenCoop: {
        bestTime: null,
        completions: 0,
        lastCompleted: null
      },
      ecoTshirt: {
        bestProfit: null,
        completions: 0,
        lastCompleted: null
      },
      waterTank: {
        bestEfficiency: null,
        completions: 0,
        lastCompleted: null
      }
    });
  };

  return (
    <GameRecordsContext.Provider value={{
      records,
      updateMultiplicationGameScore,
      updateLessonCompletion,
      getAchievementInfo,
      getAllAchievements,
      getRecentAchievements,
      resetRecords
    }}>
      {children}
    </GameRecordsContext.Provider>
  );
};