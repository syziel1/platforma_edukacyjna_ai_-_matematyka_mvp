import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGlobalTimer } from '../../contexts/GlobalTimerContext';
import { mentorAvailability } from '../../config/mentorAvailability';
import { KnowledgeMapModal } from '../KnowledgeSpace';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import GlobalHeader from '../GlobalHeader';
// ZMIANA: Importujemy dane o problemach
import { problems } from '../StartScreen';

const CockpitPage = () => {
  const { user } = useAuth();
  const { getProgress } = useProgress();
  const { t } = useLanguage();
  const { stopLearning } = useGlobalTimer();
  const navigate = useNavigate();
  const [showKnowledgeMap, setShowKnowledgeMap] = useState(false);

  // Stop learning timer when cockpit page is opened
  useEffect(() => {
    stopLearning();
    return () => {};
  }, [stopLearning]);

  const [cockpitData, setCockpitData] = useState({
    mentorSession: null,
    currentLesson: {
      id: 'chicken-coop',
      title: t('lessonChickenCoop'),
      graphic: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 0,
      currentStep: t('step1Title')
    }
  });

  useEffect(() => {
    // ZMIANA: Pobieramy dane lekcji dynamicznie
    const lessonData = problems.find(p => p.id === 'chicken-coop');
    if (!lessonData) return;

    const currentProgress = getProgress(lessonData.id);
    const totalSteps = lessonData.totalSteps; // Używamy dynamicznej wartości
    const progressPercentage = (currentProgress / totalSteps) * 100;
    
    let stepDescription = t('step1Title');
    if (currentProgress >= totalSteps) {
      stepDescription = t('goalAchieved');
    } else if (currentProgress > 0) {
      stepDescription = `${t('step')} ${currentProgress}/${totalSteps}`;
    }
    
    setCockpitData(prev => ({
      ...prev,
      currentLesson: {
        ...prev.currentLesson,
        title: t(lessonData.title),
        progress: progressPercentage,
        currentStep: stepDescription
      }
    }));
  }, [getProgress, t]);

  // ... reszta komponentu bez zmian
  
  const handleScheduleMentor = (session) => {
    setCockpitData(prev => ({
      ...prev,
      mentorSession: session
    }));
  };

  const handleContinueLesson = () => {
    navigate('/lesson/chicken-coop');
  };

  const handleStartGame = (showModeSelector = false) => {
    navigate('/game/jungle');
  };

  const handleOpenKnowledgeMap = () => {
    setShowKnowledgeMap(true);
  };

  const handleCloseKnowledgeMap = () => {
    setShowKnowledgeMap(false);
  };

  const getWelcomeMessage = () => {
    if (user) {
      return t('welcomeBack', { name: user.name });
    }
    return t('welcomeToCockpit');
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <GlobalHeader 
        title={getWelcomeMessage()}
        showBackButton={false}
      />
      
      <div className="flex-1 p-4 md:p-6 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <LeftColumn 
                mentorSession={cockpitData.mentorSession}
                currentLesson={cockpitData.currentLesson}
                onScheduleMentor={handleScheduleMentor}
                onContinueLesson={handleContinueLesson}
              />
            </div>
            <div className="lg:col-span-1">
              <RightColumn 
                onStartGame={handleStartGame}
                onOpenKnowledgeMap={handleOpenKnowledgeMap}
              />
            </div>
          </div>
        </div>
      </div>
      <KnowledgeMapModal 
        isOpen={showKnowledgeMap}
        onClose={handleCloseKnowledgeMap}
      />
    </div>
  );
};

export default CockpitPage;