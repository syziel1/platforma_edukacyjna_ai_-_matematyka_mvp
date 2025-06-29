import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('lessonProgress');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Failed to parse lesson progress from localStorage:', error);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lessonProgress', JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to save lesson progress to localStorage:', error);
    }
  }, [progress]);

  const updateProgress = (lessonId, step) => {
    setProgress(prev => ({
      ...prev,
      [lessonId]: Math.max(step, prev[lessonId] || 0)
    }));
  };

  const getProgress = (lessonId) => {
    return progress[lessonId] || 0;
  };

  return (
    <ProgressContext.Provider value={{ updateProgress, getProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};