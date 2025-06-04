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
    
    // Water Tank Scenario
    'waterTankIntro': 'Wprowadzenie do Problemu Zbiornika',
    'waterTankProblem': 'Opis Problemu',
    'waterTankDescription': 'Masz określoną ilość materiału na budowę cylindrycznego zbiornika na wodę. Twoim zadaniem jest znalezienie takich wymiarów zbiornika (promienia podstawy i wysokości), aby jego objętość była największa przy zadanej powierzchni całkowitej.',
    'waterTankHint': 'Zastanów się nad relacją między promieniem podstawy a wysokością zbiornika. Jak te wymiary wpływają na objętość i powierzchnię całkowitą?',
    'waterTankExploration': 'Eksperymentuj z Wymiarami',
    'waterTankTheory': 'Analiza Matematyczna',
    'waterTankTheoryText': 'Problem można rozwiązać używając rachunku różniczkowego. Musimy znaleźć maksimum funkcji objętości przy warunku ograniczającym powierzchnię całkowitą.',
    'waterTankOptimization': 'Aby znaleźć optymalne wymiary, należy użyć metody mnożników Lagrange\'a lub zbadać pochodne cząstkowe funkcji objętości.',
    'waterTankSolution': 'Rozwiązanie Formalne',
    'whereFormula': 'gdzie r to promień podstawy, a h to wysokość',
    
    // Interactive Elements
    'tankRadius': 'Promień podstawy',
    'tankHeight': 'Wysokość',
    'surfaceArea': 'Powierzchnia całkowita',
    'tankVolume': 'Objętość zbiornika',
    'tryMaximizeVolume': 'Spróbuj zmaksymalizować objętość!',
    'isMaximumVolume': 'Świetnie! Jesteś blisko maksymalnej objętości!',
    
    // Steps
    'step1WaterTank': 'Krok 1: Oblicz pochodną cząstkową względem r',
    'step2WaterTank': 'Krok 2: Oblicz pochodną cząstkową względem h',
    'step3WaterTank': 'Krok 3: Podaj optymalne wymiary',
    'continue': 'Dalej',
    'startExploration': 'Rozpocznij eksperymentowanie',
    'endExploration': 'Zakończ eksplorację',
    'goToFormal': 'Przejdź do rozwiązania',
    'checkAnswer': 'Sprawdź odpowiedź',
    'hint': 'Wskazówka',
    
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
    'lessonTitle': 'Problem: Water Tank - Level 1',
    'nextBreak': 'Next break in:',
    
    // Water Tank Scenario
    'waterTankIntro': 'Introduction to Tank Problem',
    'waterTankProblem': 'Problem Description',
    'waterTankDescription': 'You have a fixed amount of material to build a cylindrical water tank. Your task is to find the dimensions (base radius and height) that maximize the tank\'s volume while maintaining the given total surface area.',
    'waterTankHint': 'Think about the relationship between the base radius and height. How do these dimensions affect volume and total surface area?',
    'waterTankExploration': 'Experiment with Dimensions',
    'waterTankTheory': 'Mathematical Analysis',
    'waterTankTheoryText': 'This problem can be solved using calculus. We need to find the maximum of the volume function subject to the surface area constraint.',
    'waterTankOptimization': 'To find optimal dimensions, we can use Lagrange multipliers or examine partial derivatives of the volume function.',
    'waterTankSolution': 'Formal Solution',
    'whereFormula': 'where r is base radius and h is height',
    
    // Interactive Elements
    'tankRadius': 'Base radius',
    'tankHeight': 'Height',
    'surfaceArea': 'Total surface area',
    'tankVolume': 'Tank volume',
    'tryMaximizeVolume': 'Try to maximize the volume!',
    'isMaximumVolume': 'Great! You\'re close to maximum volume!',
    
    // Steps
    'step1WaterTank': 'Step 1: Calculate partial derivative with respect to r',
    'step2WaterTank': 'Step 2: Calculate partial derivative with respect to h',
    'step3WaterTank': 'Step 3: State optimal dimensions',
    'continue': 'Continue',
    'startExploration': 'Start experimenting',
    'endExploration': 'End exploration',
    'goToFormal': 'Go to solution',
    'checkAnswer': 'Check answer',
    'hint': 'Hint',
    
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