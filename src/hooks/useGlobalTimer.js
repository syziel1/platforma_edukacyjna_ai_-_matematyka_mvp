import { useState, useEffect } from 'react';

export const useGlobalTimer = () => {
  const [timeElapsed, setTimeElapsed] = useState(() => {
    // Sprawdź czy timer powinien być zresetowany
    const lastActivity = localStorage.getItem('lastActivity');
    const timerStart = localStorage.getItem('globalTimerStart');
    const isLearningActive = localStorage.getItem('isLearningActive') === 'true';
    
    if (lastActivity && timerStart && isLearningActive) {
      const now = Date.now();
      const lastActivityTime = parseInt(lastActivity);
      const timeSinceLastActivity = now - lastActivityTime;
      
      // Reset timera jeśli minęło więcej niż 30 minut od ostatniej aktywności
      // lub jeśli użytkownik wrócił po dłuższej przerwie
      if (timeSinceLastActivity > 30 * 60 * 1000) { // 30 minut
        localStorage.removeItem('globalTimerStart');
        localStorage.setItem('isLearningActive', 'false');
        return 0;
      }
      
      // Oblicz czas od rozpoczęcia sesji
      const startTime = parseInt(timerStart);
      return Math.floor((now - startTime) / 1000);
    }
    
    return 0;
  });

  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem('isLearningActive') === 'true';
  });

  // Funkcja do rozpoczęcia nauki
  const startLearning = () => {
    const now = Date.now();
    localStorage.setItem('globalTimerStart', now.toString());
    localStorage.setItem('lastActivity', now.toString());
    localStorage.setItem('isLearningActive', 'true');
    setIsActive(true);
    setTimeElapsed(0);
  };

  // Funkcja do zatrzymania nauki
  const stopLearning = () => {
    localStorage.setItem('isLearningActive', 'false');
    localStorage.setItem('lastActivity', Date.now().toString());
    setIsActive(false);
  };

  // Aktualizuj ostatnią aktywność przy każdej zmianie timera
  useEffect(() => {
    if (isActive) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  }, [timeElapsed, isActive]);

  // Nasłuchuj na zdarzenia aktywności użytkownika (tylko gdy nauka jest aktywna)
  useEffect(() => {
    const updateActivity = () => {
      if (isActive) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };

    // Zdarzenia wskazujące na aktywność użytkownika
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [isActive]);

  // Nasłuchuj na zdarzenia opuszczenia/powrotu do strony
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Strona została ukryta - zapisz czas
        if (isActive) {
          localStorage.setItem('lastActivity', Date.now().toString());
        }
      } else {
        // Strona została przywrócona - sprawdź czy resetować timer
        if (isActive) {
          const lastActivity = localStorage.getItem('lastActivity');
          if (lastActivity) {
            const now = Date.now();
            const timeSinceLastActivity = now - parseInt(lastActivity);
            
            // Reset timera jeśli minęło więcej niż 30 minut
            if (timeSinceLastActivity > 30 * 60 * 1000) {
              stopLearning();
            } else {
              localStorage.setItem('lastActivity', now.toString());
            }
          }
        }
      }
    };

    const handleBeforeUnload = () => {
      if (isActive) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive]);

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
    const now = Date.now();
    localStorage.setItem('globalTimerStart', now.toString());
    localStorage.setItem('lastActivity', now.toString());
    localStorage.setItem('isLearningActive', 'true');
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
    localStorage.setItem('isLearningActive', 'false');
    localStorage.setItem('lastActivity', Date.now().toString());
  };

  const resumeTimer = () => {
    setIsActive(true);
    localStorage.setItem('isLearningActive', 'true');
    localStorage.setItem('lastActivity', Date.now().toString());
  };

  // Funkcja do manualnego resetowania po przerwie
  const resetAfterBreak = () => {
    resetTimer();
  };

  return {
    timeElapsed,
    formattedTime: formatTime(timeElapsed),
    isActive,
    resetTimer,
    resetAfterBreak,
    pauseTimer,
    resumeTimer,
    startLearning,
    stopLearning
  };
};