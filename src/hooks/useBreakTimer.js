import { useState, useEffect } from 'react';

export const useBreakTimer = (breakIntervalMinutes = 25) => {
  const [timeUntilBreak, setTimeUntilBreak] = useState(breakIntervalMinutes * 60);
  const [showBreakAlert, setShowBreakAlert] = useState(false);
  const [isLearningActive, setIsLearningActive] = useState(() => {
    try {
      return localStorage.getItem('isLearningActive') === 'true';
    } catch (error) {
      console.warn('Error reading learning active state:', error);
      return false;
    }
  });

  // Nasłuchuj na zmiany statusu nauki
  useEffect(() => {
    const checkLearningStatus = () => {
      try {
        const active = localStorage.getItem('isLearningActive') === 'true';
        setIsLearningActive(active);
      } catch (error) {
        console.warn('Error checking learning status:', error);
      }
    };

    // Sprawdzaj co sekundę
    const interval = setInterval(checkLearningStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Odliczaj czas tylko gdy nauka jest aktywna
  useEffect(() => {
    let timer;
    
    if (isLearningActive) {
      try {
        // Wczytaj zapisany czas do przerwy
        const savedBreakTime = localStorage.getItem('timeUntilBreak');
        if (savedBreakTime && !showBreakAlert) {
          setTimeUntilBreak(parseInt(savedBreakTime, 10));
        }
      } catch (error) {
        console.warn('Error loading break timer:', error);
      }
      
      timer = setInterval(() => {
        setTimeUntilBreak(prev => {
          const newTime = prev <= 1 ? breakIntervalMinutes * 60 : prev - 1;
          
          try {
            // Zapisz czas do przerwy co 5 sekund
            if (newTime % 5 === 0) {
              localStorage.setItem('timeUntilBreak', newTime.toString());
            }
          } catch (error) {
            console.warn('Error saving break timer:', error);
          }
          
          // Pokaż alert o przerwie
          if (prev <= 1) {
            setShowBreakAlert(true);
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [breakIntervalMinutes, isLearningActive, showBreakAlert]);

  const resetTimer = () => {
    try {
      const newTime = breakIntervalMinutes * 60;
      setTimeUntilBreak(newTime);
      localStorage.setItem('timeUntilBreak', newTime.toString());
      setShowBreakAlert(false);
    } catch (error) {
      console.warn('Error resetting break timer:', error);
      // Still update the state even if localStorage fails
      setTimeUntilBreak(breakIntervalMinutes * 60);
      setShowBreakAlert(false);
    }
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