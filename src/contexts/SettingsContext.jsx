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
    const defaultSettings = {
      soundEnabled: true,
      volume: 0.5,
      showGrassPercentage: false,
      dailyLearningGoal: 30, // minut
      textToSpeechEnabled: false,
      textToSpeechVoice: 'ZT9u07TYPVl83ejeLakq', // Default ElevenLabs voice ID
      textToSpeechSpeed: 1.0
    };

    try {
      const saved = localStorage.getItem('gameSettings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        // Merge saved settings with default settings to ensure all properties exist
        return { ...defaultSettings, ...parsedSettings };
      }
    } catch {
      // Silent fail - use defaults
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('gameSettings', JSON.stringify(settings));
    } catch {
      // Silent fail for localStorage
    }
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

  const toggleTextToSpeech = () => {
    updateSetting('textToSpeechEnabled', !settings.textToSpeechEnabled);
  };

  const setTextToSpeechVoice = (voiceId) => {
    updateSetting('textToSpeechVoice', voiceId);
  };

  const setTextToSpeechSpeed = (speed) => {
    updateSetting('textToSpeechSpeed', Math.max(0.5, Math.min(2.0, speed)));
  };

  const resetGameState = () => {
    try {
      // Remove game state from localStorage
      localStorage.removeItem('jungleGameState');
    } catch {
      // Silent fail for localStorage
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSetting, 
      toggleSound, 
      setVolume,
      toggleGrassPercentage,
      setDailyLearningGoal,
      toggleTextToSpeech,
      setTextToSpeechVoice,
      setTextToSpeechSpeed,
      resetGameState
    }}>
      {children}
    </SettingsContext.Provider>
  );
};