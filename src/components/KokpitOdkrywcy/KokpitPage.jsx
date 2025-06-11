import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { mentorAvailability } from '../../config/mentorAvailability';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import GlobalHeader from '../GlobalHeader';

const KokpitPage = ({ onProblemSelect }) => {
  const { user } = useAuth();
  const { getProgress } = useProgress();
  const { t } = useLanguage();

  // Stan dla danych kokpitu
  const [kokpitData, setKokpitData] = useState({
    mentorSession: null, // lub obiekt z danymi sesji
    currentLesson: {
      id: 'chicken-coop',
      title: 'Lesson: Chicken Coop Optimization',
      graphic: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 0,
      currentStep: 'Introduction to the task'
    }
  });

  // Pobierz aktualny postęp lekcji
  useEffect(() => {
    const currentProgress = getProgress('chicken-coop');
    // Zwiększamy totalSteps do 8, ponieważ teraz mamy 8 kroków
    const totalSteps = 8;
    const progressPercentage = (currentProgress / totalSteps) * 100;
    
    // Określ status na podstawie postępu
    let stepDescription = 'Introduction to the task';
    if (currentProgress >= 8) {
      stepDescription = 'Task completed! 🎉';
    } else if (currentProgress >= 5) {
      stepDescription = `Formal solution - Step ${currentProgress - 4}/3`;
    } else if (currentProgress > 0) {
      stepDescription = `Step ${currentProgress}/4`;
    }
    
    setKokpitData(prev => ({
      ...prev,
      currentLesson: {
        ...prev.currentLesson,
        progress: progressPercentage,
        currentStep: stepDescription
      }
    }));
  }, [getProgress]);

  // Funkcja planowania spotkania z mentorem
  const handleScheduleMentor = (sessionData) => {
    setKokpitData(prev => ({
      ...prev,
      mentorSession: sessionData
    }));
  };

  const handleContinueLesson = () => {
    onProblemSelect(kokpitData.currentLesson.id);
  };

  // Modified to handle game mode selector
  const handleStartGame = (showModeSelector = false) => {
    if (showModeSelector) {
      // Start the jungle game with mode selector
      onProblemSelect('jungle-game');
    } else {
      // Direct game start (legacy behavior)
      onProblemSelect('jungle-game');
    }
  };

  const handleOpenKnowledgeMap = () => {
    // Placeholder - można rozszerzyć o rzeczywistą mapę wiedzy
    alert('Knowledge Map will be available soon! 🗺️');
  };

  // Wyświetl odpowiednie powitanie w zależności od statusu logowania
  const getWelcomeMessage = () => {
    if (user) {
      return `Welcome back, ${user.name}! 🚀`;
    }
    return 'Welcome to Explorer Cockpit! 🚀';
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <GlobalHeader 
        title={getWelcomeMessage()}
        showBackButton={false}
      />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Główny układ dwukolumnowy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kolumna lewa - 65% szerokości */}
            <div className="lg:col-span-1">
              <LeftColumn 
                mentorSession={kokpitData.mentorSession}
                currentLesson={kokpitData.currentLesson}
                onScheduleMentor={handleScheduleMentor}
                onContinueLesson={handleContinueLesson}
              />
            </div>
            
            {/* Kolumna prawa - 35% szerokości */}
            <div className="lg:col-span-1">
              <RightColumn 
                onStartGame={handleStartGame}
                onOpenKnowledgeMap={handleOpenKnowledgeMap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KokpitPage;