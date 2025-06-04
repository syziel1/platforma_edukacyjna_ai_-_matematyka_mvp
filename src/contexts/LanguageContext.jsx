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
    'welcomeTitle': 'Platforma Edukacyjna AI - Matematyka',
    'welcomeDesc': 'Wybierz zadanie matematyczne, które chcesz rozwiązać. Każde zadanie zawiera interaktywne elementy i wsparcie sztucznej inteligencji.',
    'startLesson': 'Rozpocznij zadanie',
    'continueLesson': 'Kontynuuj zadanie',
    'backToProblems': 'Powrót do listy zadań',
    'connectWithMentor': 'Połącz się z mentorem',
    
    // Problems
    'chickenCoopTitle': 'Zadanie: Optymalny kurnik',
    'chickenCoopDesc': 'Znajdź najlepsze wymiary kurnika przy ograniczonej długości ogrodzenia.',
    'gardenFenceTitle': 'Zadanie: Geometryczny ogród',
    'gardenFenceDesc': 'Zaprojektuj ogród o maksymalnej powierzchni przy zadanym obwodzie.',
    'waterTankTitle': 'Zadanie: Zbiornik na wodę',
    'waterTankDesc': 'Oblicz optymalne wymiary cylindrycznego zbiornika na wodę.',
    
    // Navigation
    'myTasks': 'Lista zadań',
    'dayPlan': 'Plan dnia',
    'settings': 'Ustawienia',
    'logout': 'Wyloguj się',
    'login': 'Zaloguj się',
    'skipLogin': 'Kontynuuj bez logowania',
    
    // Lesson Header
    'lessonTitle': 'Zadanie: Optymalny kurnik',
    'nextBreak': 'Następna przerwa za:',
    
    // Water Tank Problem
    'waterTankProblem': 'Opis zadania',
    'waterTankDescription': 'Twoim zadaniem jest zaprojektowanie cylindrycznego zbiornika na wodę o określonej objętości, używając jak najmniej materiału na jego konstrukcję. Jakie powinny być wymiary tego zbiornika?',
    'waterTankHint': 'Zastanów się nad relacją między wysokością a promieniem zbiornika. Jak te wymiary wpływają na objętość i powierzchnię?',
    'hint': 'Wskazówka',
    'startExploration': 'Rozpocznij eksperymentowanie',
    'waterTankExploration': 'Eksperymentuj z wymiarami',
    'tankRadius': 'Promień zbiornika',
    'tankHeight': 'Wysokość zbiornika',
    'surfaceArea': 'Powierzchnia materiału',
    'tankVolume': 'Objętość zbiornika',
    'tryMaximizeVolume': 'Spróbuj zminimalizować użycie materiału!',
    'isMaximumVolume': 'Świetnie! Jesteś blisko optymalnego rozwiązania!',
    'waterTankIntro': 'Wprowadzenie do zadania',
    'continue': 'Dalej',
    'waterTankTheory': 'Teoria matematyczna',
    'waterTankTheoryText': 'Problem optymalizacji zbiornika można rozwiązać używając rachunku różniczkowego. Kluczowe wzory to:',
    'whereFormula': 'gdzie r to promień, a h to wysokość',
    'waterTankOptimization': 'Aby znaleźć optymalne wymiary, musimy zminimalizować powierzchnię przy stałej objętości.',
    'waterTankSolution': 'Rozwiązanie formalne',
    'step1WaterTank': 'Krok 1: Oblicz pochodną względem promienia',
    'step2WaterTank': 'Krok 2: Oblicz pochodną względem wysokości',
    'step3WaterTank': 'Krok 3: Podaj optymalne proporcje',
    'endExploration': 'Zakończ eksperymentowanie',
    'goToFormal': 'Przejdź do rozwiązania',
    'checkAnswer': 'Sprawdź odpowiedź',
    
    // Chat
    'aiMentor': 'Asystent AI',
    'typeMessage': 'Napisz pytanie...',
    'send': 'Wyślij',
    
    // Break suggestions
    'breakSuggestions': 'Sugestie na przerwę:\n• Krótki spacer\n• Ćwiczenia oczu\n• Napij się wody\n• Rozciągnij się',

    // Auth
    'loginPrompt': 'Zaloguj się kontem Google, aby zapisywać swoje postępy.',
    'loginError': 'Błąd logowania. Spróbuj ponownie.',
    'welcome': 'Witaj'
  },
  en: {
    // Start Screen
    'welcomeTitle': 'AI Education Platform - Mathematics',
    'welcomeDesc': 'Choose a mathematical problem you want to solve. Each task includes interactive elements and AI support.',
    'startLesson': 'Start task',
    'continueLesson': 'Continue task',
    'backToProblems': 'Back to tasks list',
    'connectWithMentor': 'Connect with mentor',
    
    // Problems
    'chickenCoopTitle': 'Task: Optimal Chicken Coop',
    'chickenCoopDesc': 'Find the best dimensions for a chicken coop with limited fence length.',
    'gardenFenceTitle': 'Task: Geometric Garden',
    'gardenFenceDesc': 'Design a garden with maximum area given a fixed perimeter.',
    'waterTankTitle': 'Task: Water Tank',
    'waterTankDesc': 'Calculate optimal dimensions for a cylindrical water tank.',
    
    // Navigation
    'myTasks': 'Tasks list',
    'dayPlan': 'Day plan',
    'settings': 'Settings',
    'logout': 'Sign out',
    'login': 'Sign in',
    'skipLogin': 'Continue without signing in',
    
    // Lesson Header
    'lessonTitle': 'Task: Optimal Chicken Coop',
    'nextBreak': 'Next break in:',
    
    // Auth
    'loginPrompt': 'Sign in with Google to save your progress.',
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