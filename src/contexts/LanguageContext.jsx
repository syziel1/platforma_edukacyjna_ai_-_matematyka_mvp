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
    'multiplicationGameTitle': 'Gra: Szlakami matematyki',
    'multiplicationGameDesc': 'Odkrywaj tajemniczą dżunglę, ucząc się działań matematycznych w formie gry przygodowej.',
    
    // Game Mode Selector
    'chooseMathOperations': 'Wybierz rodzaj działań matematycznych',
    'chooseMathOperationsDesc': 'Wybierz, które działania chcesz ćwiczyć w dżungli matematycznej!',
    'backToMenu': 'Powrót',
    'difficultyTip': 'Każdy tryb dostosowuje poziom trudności do Twojego wieku i umiejętności!',
    'tip': 'Wskazówka:',
    
    // Math Operations
    'addition': 'Dodawanie',
    'subtraction': 'Odejmowanie', 
    'multiplication': 'Mnożenie',
    'division': 'Dzielenie',
    'exponentiation': 'Potęgowanie',
    'squareRoot': 'Pierwiastkowanie',
    'additionDesc': 'Ucz się dodawania liczb',
    'subtractionDesc': 'Ćwicz odejmowanie liczb',
    'multiplicationDesc': 'Opanuj tabliczkę mnożenia',
    'divisionDesc': 'Naucz się dzielenia liczb',
    'exponentiationDesc': 'Poznaj potęgi liczb',
    'squareRootDesc': 'Naucz się pierwiastków kwadratowych',
    
    // Welcome Modal
    'welcomeToJungle': 'Witaj w Dżungli {operation}!',
    'mathAdventure': 'Przygotuj się na przygodę matematyczną z działaniami {operation}!',
    'exampleTasks': 'Przykładowe zadania w tym trybie:',
    'startAdventure': 'Rozpocznij przygodę z {operation}!',
    'showInstructions': 'Pokaż instrukcję gry',
    
    // Instructions Modal
    'gameInstructions': 'Instrukcja gry - {operation}',
    'controls': 'Sterowanie:',
    'controlsDesc': 'Poruszaj się po planszy za pomocą klawiszy strzałek:',
    'arrowUp': 'Strzałka w górę: Idź do przodu',
    'arrowLeft': 'Strzałka w lewo: Obróć się w lewo', 
    'arrowRight': 'Strzałka w prawo: Obróć się w prawo',
    'gameRules': 'Zasady gry:',
    'solveToMove': 'Aby wejść na nowe, zarośnięte pole, musisz poprawnie rozwiązać działanie {operation}.',
    'correctAnswer': 'Poprawna odpowiedź zmniejsza trawę i pozwala przejść dalej.',
    'wrongAnswer': 'Błędna odpowiedź zwiększa trawę, utrudniając przejście.',
    'clearedFields': 'Pola z piaskiem są już odkryte - możesz na nie wchodzić swobodnie.',
    'gameGoal': 'Cel gry:',
    'discoverLevels': 'Odkrywaj kolejne poziomy, usuwając trawę i zdobywając punkty!',
    'findBonuses': 'Szukaj ukrytych bonusów 💎 - dają dodatkowe punkty!',
    'practiceOperations': 'Ćwicz działania {operation} w przyjemnej formie gry!',
    'startGame': 'Rozpocznij grę!',
    'back': 'Powrót',
    
    // Game Interface
    'gameMode': 'Tryb gry',
    'operations': 'Działania',
    'points': 'Punkty',
    'earned': 'Zdobyte',
    'time': 'Czas',
    'elapsed': 'Upłynął',
    'grassCleared': 'Trawa usunięta',
    'cleared': 'Oczyszczone',
    'level': 'Poziom',
    
    // Question Modal
    'solveTask': 'Rozwiąż zadanie',
    'yourAnswer': 'Twoja odpowiedź...',
    'checkAnswer': 'Sprawdź odpowiedź',
    'askWiseOwl': 'Zapytaj Mądrą Sowę',
    'wiseOwlThinking': 'Mądra Sowa myśli...',
    'adviceFromOwl': 'Rada od Mądrej Sowy:',
    'errors': 'Błędów:',
    'tryBreakDown': 'Spróbuj rozłożyć działanie na prostsze części',
    
    // 3D Scene Task Display
    'task': 'Zadanie',
    'pressUpToSolve': 'Naciśnij ↑ aby rozwiązać',
    
    // Messages
    'great': 'Świetnie!',
    'bonusPoints': 'Bonus',
    'wrong': 'Niestety, źle. Trawa odrasta...',
    'cannotGo': 'Nie możesz tam iść (ściana!)',
    'bonusCollected': 'Bonus zebrano!',
    
    // Navigation
    'menu': 'Menu',
    'myTasks': 'Moje zadania',
    'dayPlan': 'Plan dnia',
    'settings': 'Ustawienia',
    'logout': 'Wyloguj się',
    'login': 'Zaloguj się',
    'skipLogin': 'Kontynuuj bez logowania',
    'hint': 'Wskazówka',
    
    // Settings
    'soundEffects': 'Efekty dźwiękowe',
    'volume': 'Głośność',
    'close': 'Zamknij',
    
    // Lesson Header
    'lessonTitle': 'Zadanie: Optymalny kurnik',
    'nextBreak': 'Następna przerwa za:',
    
    // Steps
    'step1Title': 'Wprowadzenie do zadania',
    'step2Title': 'Opis problemu',
    'step3Title': 'Eksperymentowanie',
    'step4Title': 'Analiza matematyczna',
    'step5Title': 'Rozwiązanie formalne',
    'understood': 'Rozumiem',
    'endExploration': 'Zakończ eksperymentowanie',
    'goToFormal': 'Przejdź do rozwiązania',
    'problemText': 'Mamy do dyspozycji 40 metrów ogrodzenia. Chcemy zbudować prostokątny kurnik o jak największej powierzchni. Jakie powinny być jego wymiary?',
    
    // Interactive elements
    'sideA': 'Długość boku A',
    'sideB': 'Długość boku B',
    'usedFence': 'Wykorzystane ogrodzenie',
    'chickenArea': 'Powierzchnia kurnika',
    'tryMaximize': 'Spróbuj zmaksymalizować powierzchnię!',
    'isMaximum': 'Świetnie! Jesteś blisko optymalnego rozwiązania!',
    
    // Water Tank Problem
    'waterTankProblem': 'Opis zadania',
    'waterTankDescription': 'Twoim zadaniem jest zaprojektowanie cylindrycznego zbiornika na wodę o określonej objętości, używając jak najmniej materiału na jego konstrukcję. Jakie powinny być wymiary tego zbiornika?',
    'waterTankHint': 'Zastanów się nad relacją między wysokością a promieniem zbiornika. Jak te wymiary wpływają na objętość i powierzchnię?',
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
    'materialLimitExceeded': 'Przekroczono limit materiału!',
    'maximizeVolumeWithinLimit': 'Spróbuj zmaksymalizować objętość w ramach limitu materiału.',
    
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
    'multiplicationGameTitle': 'Game: Mathematical Trails',
    'multiplicationGameDesc': 'Explore a mysterious jungle while learning mathematical operations in an adventure game.',
    
    // Game Mode Selector
    'chooseMathOperations': 'Choose Mathematical Operations',
    'chooseMathOperationsDesc': 'Choose which operations you want to practice in the mathematical jungle!',
    'backToMenu': 'Back',
    'difficultyTip': 'Each mode adjusts difficulty level to your age and skills!',
    'tip': 'Tip:',
    
    // Math Operations
    'addition': 'Addition',
    'subtraction': 'Subtraction',
    'multiplication': 'Multiplication', 
    'division': 'Division',
    'exponentiation': 'Exponentiation',
    'squareRoot': 'Square Root',
    'additionDesc': 'Learn to add numbers',
    'subtractionDesc': 'Practice subtracting numbers',
    'multiplicationDesc': 'Master multiplication tables',
    'divisionDesc': 'Learn to divide numbers',
    'exponentiationDesc': 'Discover number powers',
    'squareRootDesc': 'Learn square roots',
    
    // Welcome Modal
    'welcomeToJungle': 'Welcome to the {operation} Jungle!',
    'mathAdventure': 'Get ready for a mathematical adventure with {operation} operations!',
    'exampleTasks': 'Example tasks in this mode:',
    'startAdventure': 'Start adventure with {operation}!',
    'showInstructions': 'Show game instructions',
    
    // Instructions Modal
    'gameInstructions': 'Game Instructions - {operation}',
    'controls': 'Controls:',
    'controlsDesc': 'Move around the board using arrow keys:',
    'arrowUp': 'Up Arrow: Move forward',
    'arrowLeft': 'Left Arrow: Turn left',
    'arrowRight': 'Right Arrow: Turn right',
    'gameRules': 'Game Rules:',
    'solveToMove': 'To enter a new, overgrown field, you must correctly solve a {operation} problem.',
    'correctAnswer': 'Correct answer reduces grass and allows you to move forward.',
    'wrongAnswer': 'Wrong answer increases grass, making passage more difficult.',
    'clearedFields': 'Sand fields are already cleared - you can walk on them freely.',
    'gameGoal': 'Game Goal:',
    'discoverLevels': 'Discover new levels by clearing grass and earning points!',
    'findBonuses': 'Look for hidden bonuses 💎 - they give extra points!',
    'practiceOperations': 'Practice {operation} operations in an enjoyable game format!',
    'startGame': 'Start Game!',
    'back': 'Back',
    
    // Game Interface
    'gameMode': 'Game Mode',
    'operations': 'Operations',
    'points': 'Points',
    'earned': 'Earned',
    'time': 'Time',
    'elapsed': 'Elapsed',
    'grassCleared': 'Grass Cleared',
    'cleared': 'Cleared',
    'level': 'Level',
    
    // Question Modal
    'solveTask': 'Solve the Problem',
    'yourAnswer': 'Your answer...',
    'checkAnswer': 'Check Answer',
    'askWiseOwl': 'Ask the Wise Owl',
    'wiseOwlThinking': 'Wise Owl is thinking...',
    'adviceFromOwl': 'Advice from the Wise Owl:',
    'errors': 'Errors:',
    'tryBreakDown': 'Try breaking down the operation into simpler parts',
    
    // 3D Scene Task Display
    'task': 'Task',
    'pressUpToSolve': 'Press ↑ to solve',
    
    // Messages
    'great': 'Great!',
    'bonusPoints': 'Bonus',
    'wrong': 'Sorry, wrong. Grass is growing back...',
    'cannotGo': 'You cannot go there (wall!)',
    'bonusCollected': 'Bonus collected!',
    
    // Navigation
    'menu': 'Menu',
    'myTasks': 'My Tasks',
    'dayPlan': 'Day Plan',
    'settings': 'Settings',
    'logout': 'Sign out',
    'login': 'Sign in',
    'skipLogin': 'Continue without signing in',
    'hint': 'Hint',
    
    // Settings
    'soundEffects': 'Sound Effects',
    'volume': 'Volume',
    'close': 'Close',
    
    // Lesson Header
    'lessonTitle': 'Task: Optimal Chicken Coop',
    'nextBreak': 'Next break in:',
    
    // Steps
    'step1Title': 'Task Introduction',
    'step2Title': 'Problem Description',
    'step3Title': 'Experimentation',
    'step4Title': 'Mathematical Analysis',
    'step5Title': 'Formal Solution',
    'understood': 'I understand',
    'endExploration': 'End experimentation',
    'goToFormal': 'Go to solution',
    'problemText': 'We have 40 meters of fencing available. We want to build a rectangular chicken coop with the largest possible area. What should its dimensions be?',
    
    // Interactive elements
    'sideA': 'Side A length',
    'sideB': 'Side B length',
    'usedFence': 'Used fencing',
    'chickenArea': 'Chicken coop area',
    'tryMaximize': 'Try to maximize the area!',
    'isMaximum': 'Great! You are close to the optimal solution!',
    
    // Water Tank Problem
    'waterTankProblem': 'Problem Description',
    'waterTankDescription': 'Your task is to design a cylindrical water tank with a specific volume, using as little material as possible for its construction. What should the dimensions of this tank be?',
    'waterTankHint': 'Think about the relationship between height and radius of the tank. How do these dimensions affect volume and surface area?',
    'startExploration': 'Start experimentation',
    'waterTankExploration': 'Experiment with dimensions',
    'tankRadius': 'Tank radius',
    'tankHeight': 'Tank height',
    'surfaceArea': 'Material surface',
    'tankVolume': 'Tank volume',
    'tryMaximizeVolume': 'Try to minimize material usage!',
    'isMaximumVolume': 'Great! You are close to the optimal solution!',
    'waterTankIntro': 'Task Introduction',
    'continue': 'Continue',
    'waterTankTheory': 'Mathematical Theory',
    'waterTankTheoryText': 'The tank optimization problem can be solved using differential calculus. Key formulas are:',
    'whereFormula': 'where r is radius and h is height',
    'waterTankOptimization': 'To find optimal dimensions, we must minimize surface area with constant volume.',
    'waterTankSolution': 'Formal Solution',
    'step1WaterTank': 'Step 1: Calculate derivative with respect to radius',
    'step2WaterTank': 'Step 2: Calculate derivative with respect to height',
    'step3WaterTank': 'Step 3: Provide optimal proportions',
    'materialLimitExceeded': 'Material limit exceeded!',
    'maximizeVolumeWithinLimit': 'Try to maximize volume within the material limit.',
    
    // Chat
    'aiMentor': 'AI Assistant',
    'typeMessage': 'Type a question...',
    'send': 'Send',
    
    // Break suggestions
    'breakSuggestions': 'Break suggestions:\n• Short walk\n• Eye exercises\n• Drink water\n• Stretch',

    // Auth
    'loginPrompt': 'Sign in with Google to save your progress.',
    'loginError': 'Login failed. Please try again.',
    'welcome': 'Welcome'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pl');

  const translate = (key, params = {}) => {
    let translation = translations[currentLanguage][key] || key;
    
    // Replace placeholders like {operation} with actual values
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
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