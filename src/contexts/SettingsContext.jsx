import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('gameSettings');
    return saved ? JSON.parse(saved) : {
      soundEnabled: true,
      volume: 0.5,
      showGrassPercentage: false,
      dailyLearningGoal: 60 // Default to 60 minutes
    };
  });

  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSound = () => {
    updateSetting('soundEnabled', !settings.soundEnabled);
  };

  const setVolume = (volume) => {
    updateSetting('volume', Math.max(0, Math.min(1, volume)));
  };

  const toggleGrassPercentage = () => {
    updateSetting('showGrassPercentage', !settings.showGrassPercentage);
  };

  const setDailyLearningGoal = (minutes) => {
    updateSetting('dailyLearningGoal', minutes);
  };

  const resetGameState = () => {
    // Remove game state from localStorage
    localStorage.removeItem('jungleGameState');
    
    // Optionally trigger a page reload to reset the game completely
    // window.location.reload();
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSetting, 
      toggleSound, 
      setVolume,
      toggleGrassPercentage,
      setDailyLearningGoal,
      resetGameState
    }}>
      {children}
    </SettingsContext.Provider>
  );
};