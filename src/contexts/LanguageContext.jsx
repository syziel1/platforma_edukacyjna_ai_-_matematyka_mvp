import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  pl: {
    // Start Screen
    'welcomeTitle': 'Witaj w Platformie Edukacyjnej AI',
    'welcomeDesc': 'Wybierz problem matematyczny, który chcesz rozwiązać. Każde zadanie zawiera interaktywne elementy i wsparcie AI.',
    'startLesson': 'Rozpocznij lekcję',
    'continueLesson': 'Kontynuuj lekcję',
    'backToProblems': 'Powrót do listy problemów',
    'connectWithMentor': 'Połącz się wideo z mentorem',
    
    // Problems
    'chickenCoopTitle': 'Optymalny Kurnik',
    'chickenCoopDesc': 'Znajdź najlepsze wymiary kurnika przy ograniczonej długości siatki.',
    'gardenFenceTitle': 'Geometryczny Ogród',
    'gardenFenceDesc': 'Zaprojektuj ogród o maksymalnej powierzchni przy zadanym obwodzie.',
    'waterTankTitle': 'Zbiornik na Wodę',
    'waterTankDesc': 'Oblicz optymalne wymiary cylindrycznego zbiornika na wodę.',
    
    // Navigation
    'myTasks': 'Moje Zadania',
    'dayPlan': 'Plan Dnia',
    'settings': 'Ustawienia',
    'logout': 'Wyloguj się',
    'login': 'Zaloguj się',
    'skipLogin': 'Pomiń logowanie',
    
    // Lesson Header
    'lessonTitle': 'Problem: Optymalny Kurnik - Poziom 1',
    'nextBreak': 'Następna przerwa za:',
    
    // Auth
    'loginPrompt': 'Zaloguj się swoim kontem Google, aby rozpocząć naukę.',
    'loginError': 'Błąd logowania. Spróbuj ponownie.',
    'welcome': 'Witaj'
  },
  en: {
    // Start Screen
    'welcomeTitle': 'Welcome to AI Education Platform',
    'welcomeDesc': 'Choose a mathematical problem you want to solve. Each task includes interactive elements and AI support.',
    'startLesson': 'Start lesson',
    'continueLesson': 'Continue lesson',
    'backToProblems': 'Back to problems list',
    'connectWithMentor': 'Connect with mentor via video',
    
    // Problems
    'chickenCoopTitle': 'Optimal Chicken Coop',
    'chickenCoopDesc': 'Find the best dimensions for a chicken coop with limited fence length.',
    'gardenFenceTitle': 'Geometric Garden',
    'gardenFenceDesc': 'Design a garden with maximum area given a fixed perimeter.',
    'waterTankTitle': 'Water Tank',
    'waterTankDesc': 'Calculate optimal dimensions for a cylindrical water tank.',
    
    // Navigation
    'myTasks': 'My Tasks',
    'dayPlan': 'Day Plan',
    'settings': 'Settings',
    'logout': 'Sign out',
    'login': 'Sign in',
    'skipLogin': 'Skip login',
    
    // Lesson Header
    'lessonTitle': 'Problem: Optimal Chicken Coop - Level 1',
    'nextBreak': 'Next break in:',
    
    // Auth
    'loginPrompt': 'Sign in with your Google account to start learning.',
    'loginError': 'Login failed. Please try again.',
    'welcome': 'Welcome'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pl');

  const translate = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const switchLanguage = () => {
    setCurrentLanguage(prev => prev === 'pl' ? 'en' : 'pl');
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      translate, 
      switchLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};