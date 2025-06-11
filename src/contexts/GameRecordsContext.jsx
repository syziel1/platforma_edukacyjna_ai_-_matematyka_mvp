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
    const defaultRecords = {
      jungleGame: {
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

    try {
      const saved = localStorage.getItem('gameRecords');
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Deep merge saved data with default structure to ensure all properties exist
        return {
          jungleGame: {
            ...defaultRecords.jungleGame,
            ...(parsedData.jungleGame || {})
          },
          chickenCoop: {
            ...defaultRecords.chickenCoop,
            ...(parsedData.chickenCoop || {})
          },
          ecoTshirt: {
            ...defaultRecords.ecoTshirt,
            ...(parsedData.ecoTshirt || {})
          },
          waterTank: {
            ...defaultRecords.waterTank,
            ...(parsedData.waterTank || {})
          }
        };
      }
    } catch (error) {
      console.warn('Failed to parse game records from localStorage:', error);
    }
    
    return defaultRecords;
  });

  useEffect(() => {
    localStorage.setItem('gameRecords', JSON.stringify(records));
  }, [records]);

  const updateJungleGameScore = (score, timeSpent) => {
    setRecords(prev => {
      const gameData = prev.jungleGame;
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
      if (score >= 500 && !newAchievements.includes('score-500')) {
        newAchievements.push('score-500');
      }
      if (score >= 1000 && !newAchievements.includes('score-1000')) {
        newAchievements.push('score-1000');
      }
      if (score >= 2000 && !newAchievements.includes('score-2000')) {
        newAchievements.push('score-2000');
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
        jungleGame: {
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
        name: 'First Step',
        description: 'Complete your first game',
        icon: '🎯'
      },
      'score-500': {
        name: '500 Points',
        description: 'Score 500 points in one game',
        icon: '🏆'
      },
      'score-1000': {
        name: 'Math Master',
        description: 'Score 1000 points in one game',
        icon: '🌟'
      },
      'score-2000': {
        name: 'Jungle Legend',
        description: 'Score 2000 points in one game',
        icon: '👑'
      },
      'games-10': {
        name: 'Persistent Explorer',
        description: 'Play 10 games',
        icon: '💪'
      },
      'games-50': {
        name: 'Jungle Veteran',
        description: 'Play 50 games',
        icon: '🎖️'
      }
    };
    
    return achievements[achievementId] || { name: achievementId, description: '', icon: '🏅' };
  };

  const getAllAchievements = () => {
    return records.jungleGame.achievements.map(id => ({
      id,
      ...getAchievementInfo(id)
    }));
  };

  const getRecentAchievements = (limit = 4) => {
    return getAllAchievements().slice(-limit);
  };

  const resetRecords = () => {
    setRecords({
      jungleGame: {
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
      updateJungleGameScore,
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