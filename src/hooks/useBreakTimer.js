import { useState, useEffect } from 'react';

export const useBreakTimer = (breakIntervalMinutes = 25) => {
  const [timeUntilBreak, setTimeUntilBreak] = useState(breakIntervalMinutes * 60);
  const [showBreakAlert, setShowBreakAlert] = useState(false);
  const [isLearningActive, setIsLearningActive] = useState(() => {
    return localStorage.getItem('isLearningActive') === 'true';
  });

  // Nasłuchuj na zmiany statusu nauki
  useEffect(() => {
    const checkLearningStatus = () => {
      const active = localStorage.getItem('isLearningActive') === 'true';
      setIsLearningActive(active);
    };

    // Sprawdzaj co sekundę
    const interval = setInterval(checkLearningStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Odliczaj czas tylko gdy nauka jest aktywna
  useEffect(() => {
    let timer;
    
    if (isLearningActive) {
      timer = setInterval(() => {
        setTimeUntilBreak(prev => {
          if (prev <= 1) {
            setShowBreakAlert(true);
            return breakIntervalMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [breakIntervalMinutes, isLearningActive]);

  const resetTimer = () => {
    setTimeUntilBreak(breakIntervalMinutes * 60);
    setShowBreakAlert(false);
  };

  const handleBreakTaken = (resetGlobalTimer) => {
    resetTimer();
    if (resetGlobalTimer) {
      resetGlobalTimer();
    }
  };

  const formattedTime = () => {
    const minutes = Math.floor(timeUntilBreak / 60);
    const seconds = timeUntilBreak % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    formattedTime: formattedTime(),
    showBreakAlert,
    resetTimer,
    setShowBreakAlert,
    handleBreakTaken,
    isLearningActive
  };
};