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
      volume: 0.5
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

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSetting, 
      toggleSound, 
      setVolume 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};