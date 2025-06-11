import { useState, useEffect } from 'react';

export const useBreakTimer = (initialMinutes = 25) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(true);
  const [showBreakAlert, setShowBreakAlert] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setShowBreakAlert(true);
            setIsActive(false);
            return initialMinutes * 60; // Reset timer
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, initialMinutes]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(initialMinutes * 60);
    setIsActive(true);
    setShowBreakAlert(false);
  };

  // Funkcja do resetowania timera globalnego po przerwie
  const handleBreakTaken = (resetGlobalTimer) => {
    resetTimer();
    if (resetGlobalTimer) {
      resetGlobalTimer(); // Reset timera globalnego
    }
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    showBreakAlert,
    resetTimer,
    handleBreakTaken,
    setShowBreakAlert
  };
};