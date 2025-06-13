import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { mentorAvailability } from '../../config/mentorAvailability';
import { KnowledgeMapModal } from '../KnowledgeSpace';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import GlobalHeader from '../GlobalHeader';

const CockpitPage = ({ onProblemSelect }) => {
  const { user } = useAuth();
  const { getProgress } = useProgress();
  const { t } = useLanguage();
  const [showKnowledgeMap, setShowKnowledgeMap] = useState(false);

  // Stan dla danych kokpitu
  const [cockpitData, setCockpitData] = useState({
    mentorSession: null, // lub obiekt z danymi sesji
    currentLesson: {
      id: 'chicken-coop',
      title: t('lessonChickenCoop'),
      graphic: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 0,
      currentStep: t('step1Title')
    }
  });

  // Pobierz aktualny postęp lekcji
  useEffect(() => {
    const currentProgress = getProgress('chicken-coop');
    // Zwiększamy totalSteps do 8, ponieważ teraz mamy 8 kroków
    const totalSteps = 8;
    const progressPercentage = (currentProgress / totalSteps) * 100;
    
    // Określ status na podstawie postępu
    let stepDescription = t('step1Title');
    if (currentProgress >= 8) {
      stepDescription = t('goalAchieved');
    } else if (currentProgress >= 5) {
      stepDescription = `${t('goToFormal')} - ${t('step')} ${currentProgress - 4}/3`;
    } else if (currentProgress > 0) {
      stepDescription = `${t('step')} ${currentProgress}/4`;
    }
    
    setCockpitData(prev => ({
      ...prev,
      currentLesson: {
        ...prev.currentLesson,
        title: t('lessonChickenCoop'),
        progress: progressPercentage,
        currentStep: stepDescription
      }
    }));
  }, [getProgress, t]);

  // Funkcja planowania spotkania z mentorem
  const handleScheduleMentor = (session) => {
    setCockpitData(prev => ({
      ...prev,
      mentorSession: session
    }));
  };

  const handleContinueLesson = () => {
    onProblemSelect(cockpitData.currentLesson.id);
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
    setShowKnowledgeMap(true);
  };

  const handleCloseKnowledgeMap = () => {
    setShowKnowledgeMap(false);
  };

  // Wyświetl odpowiednie powitanie w zależności od statusu logowania
  const getWelcomeMessage = () => {
    if (user) {
      return t('welcomeBack', { name: user.name });
    }
    return t('welcomeToCockpit');
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
                mentorSession={cockpitData.mentorSession}
                currentLesson={cockpitData.currentLesson}
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
      {/* Knowledge Map Modal */}
      <KnowledgeMapModal 
        isOpen={showKnowledgeMap}
        onClose={handleCloseKnowledgeMap}
      />
    </div>
  );
};

export default CockpitPage;