import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useGlobalTimer = () => {
  const { settings } = useSettings();
  
  // Sprawdź czy timer powinien być zresetowany ze względu na zmianę dnia
  const shouldResetDueToNewDay = () => {
    const lastDate = localStorage.getItem('lastLearningDate');
    if (!lastDate) return false;
    
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    return lastDate !== today;
  };

  // Inicjalizacja stanu timera
  const [timeElapsed, setTimeElapsed] = useState(() => {
    // Sprawdź czy to nowy dzień - jeśli tak, zresetuj timer
    if (shouldResetDueToNewDay()) {
      localStorage.setItem('learningTimeElapsed', '0');
      localStorage.setItem('lastLearningDate', new Date().toISOString().split('T')[0]);
      return 0;
    }
    
    // Wczytaj zapisany czas nauki
    const savedTime = localStorage.getItem('learningTimeElapsed');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  const [isActive, setIsActive] = useState(() => {
    return localStorage.getItem('isLearningActive') === 'true';
  });

  // Zapisz dzisiejszą datę przy pierwszym uruchomieniu
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('lastLearningDate', today);
  }, []);

  // Funkcja do rozpoczęcia nauki
  const startLearning = () => {
    // Sprawdź czy to nowy dzień
    if (shouldResetDueToNewDay()) {
      setTimeElapsed(0);
      localStorage.setItem('learningTimeElapsed', '0');
      localStorage.setItem('lastLearningDate', new Date().toISOString().split('T')[0]);
    }
    
    localStorage.setItem('isLearningActive', 'true');
    localStorage.setItem('lastActivity', Date.now().toString());
    setIsActive(true);
  };

  // Funkcja do zatrzymania nauki - zapisuje aktualny czas
  const stopLearning = () => {
    localStorage.setItem('isLearningActive', 'false');
    localStorage.setItem('lastActivity', Date.now().toString());
    // Zapisz aktualny czas nauki przed zatrzymaniem
    localStorage.setItem('learningTimeElapsed', timeElapsed.toString());
    setIsActive(false);
  };

  // Aktualizuj ostatnią aktywność przy każdej zmianie timera
  useEffect(() => {
    if (isActive) {
      localStorage.setItem('lastActivity', Date.now().toString());
      // Zapisuj czas nauki co 5 sekund
      if (timeElapsed % 5 === 0) {
        localStorage.setItem('learningTimeElapsed', timeElapsed.toString());
      }
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
          localStorage.setItem('learningTimeElapsed', timeElapsed.toString());
        }
      } else {
        // Strona została przywrócona - sprawdź czy resetować timer
        if (isActive) {
          const lastActivity = localStorage.getItem('lastActivity');
          if (lastActivity) {
            const now = Date.now();
            const timeSinceLastActivity = now - parseInt(lastActivity);
            
            // Jeśli minęło więcej niż 30 minut, zatrzymaj liczenie czasu
            if (timeSinceLastActivity > 30 * 60 * 1000) {
              stopLearning();
            } else {
              localStorage.setItem('lastActivity', now.toString());
            }
          }
          
          // Sprawdź czy to nowy dzień
          if (shouldResetDueToNewDay()) {
            setTimeElapsed(0);
            localStorage.setItem('learningTimeElapsed', '0');
            localStorage.setItem('lastLearningDate', new Date().toISOString().split('T')[0]);
          }
        }
      }
    };

    const handleBeforeUnload = () => {
      // Zapisz czas nauki przed zamknięciem strony
      if (isActive) {
        localStorage.setItem('lastActivity', Date.now().toString());
        localStorage.setItem('learningTimeElapsed', timeElapsed.toString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive, timeElapsed, stopLearning]);

  // Aktualizuj timer co sekundę, gdy nauka jest aktywna
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(time => {
          const newTime = time + 1;
          // Zapisuj czas co 5 sekund
          if (newTime % 5 === 0) {
            localStorage.setItem('learningTimeElapsed', newTime.toString());
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Zapisz czas nauki do statystyk dziennych
  useEffect(() => {
    if (isActive && timeElapsed > 0 && timeElapsed % 60 === 0) { // Co minutę
      const today = new Date().toISOString().split('T')[0];
      const savedStats = localStorage.getItem('dailyLearningStats');
      const stats = savedStats ? JSON.parse(savedStats) : {};
      
      // Zapisz czas w minutach
      stats[today] = Math.floor(timeElapsed / 60);
      localStorage.setItem('dailyLearningStats', JSON.stringify(stats));
    }
  }, [timeElapsed, isActive]);

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
    localStorage.setItem('learningTimeElapsed', '0');
    localStorage.setItem('lastActivity', Date.now().toString());
    localStorage.setItem('isLearningActive', 'true');
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
    localStorage.setItem('isLearningActive', 'false');
    localStorage.setItem('lastActivity', Date.now().toString());
    localStorage.setItem('learningTimeElapsed', timeElapsed.toString());
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