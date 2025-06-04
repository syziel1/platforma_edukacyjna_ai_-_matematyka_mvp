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
    'logout': 'Wyloguj',
    
    // Lesson Header
    'lessonTitle': 'Problem: Optymalny Kurnik - Poziom 1',
    'nextBreak': 'Następna przerwa za:',
    
    // Lesson Steps
    'step1Title': 'Wprowadzenie Wideo',
    'step2Title': 'Opis Problemu',
    'step3Title': 'Interaktywna Eksploracja',
    'step4Title': 'Narzędzia Matematyczne',
    'step5Title': 'Formalne Rozwiązanie',
    
    'problemText': 'Masz pewną długość siatki ogrodzeniowej i chcesz zbudować prostokątny kurnik o największej możliwej powierzchni. Jakie powinny być wymiary tego kurnika?',
    'understood': 'Zrozumiałem, chcę eksperymentować',
    'endExploration': 'Zakończ Eksplorację / Przejdź do Teorii',
    'goToFormal': 'Przejdź do Zadania Formalnego',
    'checkAnswer': 'Sprawdź Odpowiedź / Zakończ Poziom',
    
    // Interactive Visualization
    'sideA': 'Bok A',
    'sideB': 'Bok B',
    'usedFence': 'Użyta siatka',
    'chickenArea': 'Powierzchnia kurnika',
    'tryMaximize': 'Spróbuj znaleźć największe pole!',
    'isMaximum': 'Czy to już maksimum?',
    
    // Chat
    'aiMentor': 'Mentor AI 🤖',
    'typeMessage': 'Napisz pytanie...',
    'send': 'Wyślij',
    
    // Break suggestions
    'breakSuggestions': 'Sugestie na przerwę:\n• Krótki spacer\n• Ćwiczenia oczu\n• Napij się wody\n• Rozciągnij się'
  },
  en: {
    // Start Screen
    'welcomeTitle': 'Welcome to AI Education Platform',
    'welcomeDesc': 'Choose a mathematical problem you want to solve. Each task includes interactive elements and AI support.',
    'startLesson': 'Start lesson',
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
    'logout': 'Logout',
    
    // Lesson Header
    'lessonTitle': 'Problem: Optimal Chicken Coop - Level 1',
    'nextBreak': 'Next break in:',
    
    // Lesson Steps
    'step1Title': 'Video Introduction',
    'step2Title': 'Problem Description',
    'step3Title': 'Interactive Exploration',
    'step4Title': 'Mathematical Tools',
    'step5Title': 'Formal Solution',
    
    'problemText': 'You have a certain length of fence and want to build a rectangular chicken coop with the largest possible area. What should be the dimensions of this coop?',
    'understood': 'I understand, I want to experiment',
    'endExploration': 'End Exploration / Go to Theory',
    'goToFormal': 'Go to Formal Task',
    'checkAnswer': 'Check Answer / Complete Level',
    
    // Interactive Visualization
    'sideA': 'Side A',
    'sideB': 'Side B',
    'usedFence': 'Used fence',
    'chickenArea': 'Chicken coop area',
    'tryMaximize': 'Try to find the largest area!',
    'isMaximum': 'Is this the maximum?',
    
    // Chat
    'aiMentor': 'AI Mentor 🤖',
    'typeMessage': 'Type your question...',
    'send': 'Send',
    
    // Break suggestions
    'breakSuggestions': 'Break suggestions:\n• Take a short walk\n• Eye exercises\n• Drink water\n• Stretch'
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