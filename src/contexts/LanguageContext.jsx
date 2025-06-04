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
    'logout': 'Wyloguj się',
    
    // Lesson Header
    'lessonTitle': 'Problem: Optymalny Kurnik - Poziom 1',
    'nextBreak': 'Następna przerwa za:',
    
    // Water Tank Problem
    'waterTankProblem': 'Opis Problemu',
    'waterTankDescription': 'Masz za zadanie zaprojektować cylindryczny zbiornik na wodę o określonej objętości, używając jak najmniej materiału na jego konstrukcję. Jakie powinny być wymiary tego zbiornika?',
    'waterTankHint': 'Zastanów się nad relacją między wysokością a promieniem zbiornika. Jak te wymiary wpływają na objętość i powierzchnię?',
    'hint': 'Wskazówka',
    'startExploration': 'Rozpocznij eksplorację',
    'waterTankExploration': 'Eksperymentuj z wymiarami',
    'tankRadius': 'Promień zbiornika',
    'tankHeight': 'Wysokość zbiornika',
    'surfaceArea': 'Powierzchnia materiału',
    'tankVolume': 'Objętość zbiornika',
    'tryMaximizeVolume': 'Spróbuj zminimalizować użycie materiału!',
    'isMaximumVolume': 'Świetnie! Jesteś blisko optymalnego rozwiązania!',
    'waterTankIntro': 'Wprowadzenie do problemu',
    'continue': 'Dalej',
    'waterTankTheory': 'Teoria matematyczna',
    'waterTankTheoryText': 'Problem optymalizacji zbiornika można rozwiązać używając rachunku różniczkowego. Kluczowe wzory to:',
    'whereFormula': 'gdzie r to promień, a h to wysokość',
    'waterTankOptimization': 'Aby znaleźć optymalne wymiary, musimy zminimalizować powierzchnię przy stałej objętości.',
    'waterTankSolution': 'Rozwiązanie formalne',
    'step1WaterTank': 'Krok 1: Oblicz pochodną względem promienia',
    'step2WaterTank': 'Krok 2: Oblicz pochodną względem wysokości',
    'step3WaterTank': 'Krok 3: Podaj optymalne proporcje',
    'endExploration': 'Zakończ eksplorację',
    'goToFormal': 'Przejdź do rozwiązania',
    'checkAnswer': 'Sprawdź odpowiedź',
    
    // Chat
    'aiMentor': 'Mentor AI 🤖',
    'typeMessage': 'Napisz pytanie...',
    'send': 'Wyślij',
    
    // Break suggestions
    'breakSuggestions': 'Sugestie na przerwę:\n• Krótki spacer\n• Ćwiczenia oczu\n• Napij się wody\n• Rozciągnij się',

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
    
    // Lesson Header
    'lessonTitle': 'Problem: Optimal Chicken Coop - Level 1',
    'nextBreak': 'Next break in:',
    
    // Water Tank Problem
    'waterTankProblem': 'Problem Description',
    'waterTankDescription': 'Your task is to design a cylindrical water tank with a specific volume using the least amount of material for its construction. What should be the dimensions of this tank?',
    'waterTankHint': 'Think about the relationship between height and radius. How do these dimensions affect volume and surface area?',
    'hint': 'Hint',
    'startExploration': 'Start exploration',
    'waterTankExploration': 'Experiment with dimensions',
    'tankRadius': 'Tank radius',
    'tankHeight': 'Tank height',
    'surfaceArea': 'Material surface area',
    'tankVolume': 'Tank volume',
    'tryMaximizeVolume': 'Try to minimize material usage!',
    'isMaximumVolume': 'Great! You\'re close to the optimal solution!',
    'waterTankIntro': 'Problem introduction',
    'continue': 'Continue',
    'waterTankTheory': 'Mathematical theory',
    'waterTankTheoryText': 'The tank optimization problem can be solved using calculus. Key formulas are:',
    'whereFormula': 'where r is radius and h is height',
    'waterTankOptimization': 'To find optimal dimensions, we need to minimize surface area with constant volume.',
    'waterTankSolution': 'Formal solution',
    'step1WaterTank': 'Step 1: Calculate derivative with respect to radius',
    'step2WaterTank': 'Step 2: Calculate derivative with respect to height',
    'step3WaterTank': 'Step 3: State optimal proportions',
    'endExploration': 'End exploration',
    'goToFormal': 'Go to solution',
    'checkAnswer': 'Check answer',
    
    // Chat
    'aiMentor': 'AI Mentor 🤖',
    'typeMessage': 'Type your question...',
    'send': 'Send',
    
    // Break suggestions
    'breakSuggestions': 'Break suggestions:\n• Take a short walk\n• Eye exercises\n• Drink water\n• Stretch',

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