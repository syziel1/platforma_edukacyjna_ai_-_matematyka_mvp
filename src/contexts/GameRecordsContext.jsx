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
      },
      learningStreaks: {
        currentStreak: 0,
        bestStreak: 0,
        lastLearningDate: null,
        streakAchievements: []
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
          },
          learningStreaks: {
            ...defaultRecords.learningStreaks,
            ...(parsedData.learningStreaks || {})
          }
        };
      }
    } catch (error) {
      console.warn('Failed to parse game records from localStorage:', error);
    }
    
    return defaultRecords;
  });

  useEffect(() => {
    try {
      localStorage.setItem('gameRecords', JSON.stringify(records));
    } catch (error) {
      console.warn('Failed to save game records to localStorage:', error);
    }
  }, [records]);

  // Check and update learning streak daily
  useEffect(() => {
    const checkLearningStreak = () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Get daily learning stats
        const savedStats = localStorage.getItem('dailyLearningStats');
        if (!savedStats) return;
        
        const stats = JSON.parse(savedStats);
        const todayMinutes = stats[today] || 0;
        
        // Only count days with at least 5 minutes of learning
        if (todayMinutes < 5) return;
        
        setRecords(prev => {
          const { lastLearningDate, currentStreak, bestStreak, streakAchievements } = prev.learningStreaks;
          
          // If this is the first learning day or it's a new day
          if (!lastLearningDate || lastLearningDate !== today) {
            // Check if it's consecutive with the previous day
            let newStreak = currentStreak;
            let newAchievements = [...streakAchievements];
            
            if (!lastLearningDate) {
              // First time learning
              newStreak = 1;
            } else {
              // Check if yesterday
              const lastDate = new Date(lastLearningDate);
              const todayDate = new Date(today);
              const diffTime = Math.abs(todayDate - lastDate);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) {
                // Consecutive day
                newStreak += 1;
                
                // Check for streak achievements
                if (newStreak === 3 && !newAchievements.includes('streak-3')) {
                  newAchievements.push('streak-3');
                }
                if (newStreak === 5 && !newAchievements.includes('streak-5')) {
                  newAchievements.push('streak-5');
                }
                if (newStreak === 7 && !newAchievements.includes('streak-7')) {
                  newAchievements.push('streak-7');
                }
                if (newStreak === 14 && !newAchievements.includes('streak-14')) {
                  newAchievements.push('streak-14');
                }
                if (newStreak === 30 && !newAchievements.includes('streak-30')) {
                  newAchievements.push('streak-30');
                }
              } else if (diffDays > 1) {
                // Streak broken
                newStreak = 1;
              }
            }
            
            // Update best streak if needed
            const newBestStreak = Math.max(bestStreak, newStreak);
            
            return {
              ...prev,
              learningStreaks: {
                currentStreak: newStreak,
                bestStreak: newBestStreak,
                lastLearningDate: today,
                streakAchievements: newAchievements
              }
            };
          }
          
          return prev;
        });
      } catch (error) {
        console.warn('Error updating learning streak:', error);
      }
    };
    
    // Check streak on component mount
    checkLearningStreak();
    
    // Set up interval to check periodically (every 5 minutes)
    const interval = setInterval(checkLearningStreak, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

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
      // Game achievements
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
      },
      
      // Learning streak achievements
      'streak-3': {
        name: 'Learning Habit',
        description: '3 days learning streak',
        icon: '🔥'
      },
      'streak-5': {
        name: 'Dedicated Learner',
        description: '5 days learning streak',
        icon: '📚'
      },
      'streak-7': {
        name: 'Weekly Champion',
        description: '7 days learning streak',
        icon: '🏅'
      },
      'streak-14': {
        name: 'Fortnight Scholar',
        description: '14 days learning streak',
        icon: '🧠'
      },
      'streak-30': {
        name: 'Knowledge Master',
        description: '30 days learning streak',
        icon: '🎓'
      }
    };
    
    return achievements[achievementId] || { name: achievementId, description: '', icon: '🏅' };
  };

  const getAllAchievements = () => {
    // Combine achievements from all sources
    const gameAchievements = records.jungleGame.achievements.map(id => ({
      id,
      ...getAchievementInfo(id),
      source: 'game'
    }));
    
    const streakAchievements = records.learningStreaks.streakAchievements.map(id => ({
      id,
      ...getAchievementInfo(id),
      source: 'streak'
    }));
    
    // Combine and sort by most recent first (assuming the arrays are already in chronological order)
    return [...gameAchievements, ...streakAchievements];
  };

  const getRecentAchievements = (limit = 4) => {
    return getAllAchievements().slice(-limit);
  };

  const getCurrentStreak = () => {
    return records.learningStreaks.currentStreak;
  };

  const getBestStreak = () => {
    return records.learningStreaks.bestStreak;
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
      },
      learningStreaks: {
        currentStreak: 0,
        bestStreak: 0,
        lastLearningDate: null,
        streakAchievements: []
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
      getCurrentStreak,
      getBestStreak,
      resetRecords
    }}>
      {children}
    </GameRecordsContext.Provider>
  );
};