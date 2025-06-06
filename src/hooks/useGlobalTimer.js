import { useState, useEffect } from 'react';

export const useGlobalTimer = () => {
  const [timeElapsed, setTimeElapsed] = useState(() => {
    // Pobierz zapisany czas z localStorage lub rozpocznij od 0
    const saved = localStorage.getItem('globalTimerStart');
    if (saved) {
      const startTime = parseInt(saved);
      const now = Date.now();
      return Math.floor((now - startTime) / 1000);
    }
    return 0;
  });

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Zapisz czas rozpoczęcia w localStorage przy pierwszym uruchomieniu
    const saved = localStorage.getItem('globalTimerStart');
    if (!saved) {
      localStorage.setItem('globalTimerStart', Date.now().toString());
    }
  }, []);

  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeElapsed(0);
    localStorage.setItem('globalTimerStart', Date.now().toString());
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resumeTimer = () => {
    setIsActive(true);
  };

  return {
    timeElapsed,
    formattedTime: formatTime(timeElapsed),
    isActive,
    resetTimer,
    pauseTimer,
    resumeTimer
  };
};