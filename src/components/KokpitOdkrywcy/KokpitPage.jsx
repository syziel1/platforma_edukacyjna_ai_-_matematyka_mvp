import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import GlobalHeader from '../GlobalHeader';

const KokpitPage = ({ onProblemSelect }) => {
  const { user } = useAuth();
  const { getProgress } = useProgress();
  const { t } = useLanguage();

  // Stan dla danych kokpitu
  const [kokpitData, setKokpitData] = useState({
    timeRemaining: 3600, // 1 godzina w sekundach
    mentorSession: null, // lub obiekt z danymi sesji
    currentLesson: {
      id: 'chicken-coop',
      title: 'Lekcja: Optymalizacja przy użyciu funkcji kwadratowej',
      graphic: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 0,
      currentStep: 'Wprowadzenie do zadania'
    },
    bestScore: 1250,
    recentBadges: [
      { id: 1, name: 'Pierwszy Krok', iconUrl: '🏆' },
      { id: 2, name: 'Matematyk', iconUrl: '🧮' },
      { id: 3, name: 'Odkrywca', iconUrl: '🔍' },
      { id: 4, name: 'Wytrwały', iconUrl: '💪' }
    ],
    totalBadgeCount: 12
  });

  // Pobierz aktualny postęp lekcji
  useEffect(() => {
    const currentProgress = getProgress('chicken-coop');
    const progressPercentage = (currentProgress / 5) * 100;
    
    setKokpitData(prev => ({
      ...prev,
      currentLesson: {
        ...prev.currentLesson,
        progress: progressPercentage,
        currentStep: currentProgress > 0 ? `Krok ${currentProgress}/5` : 'Wprowadzenie do zadania'
      }
    }));
  }, [getProgress]);

  // Timer odliczający czas
  useEffect(() => {
    const timer = setInterval(() => {
      setKokpitData(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Symulacja sesji z mentorem (można rozszerzyć o prawdziwe API)
  const handleScheduleMentor = () => {
    setKokpitData(prev => ({
      ...prev,
      mentorSession: {
        name: 'Dr Anna Kowalska',
        date: 'Dziś',
        time: '15:30',
        zoomLink: 'http://strefaedukacji.zrozoomai.pl/'
      }
    }));
  };

  const handleContinueLesson = () => {
    onProblemSelect(kokpitData.currentLesson.id);
  };

  const handleStartGame = () => {
    onProblemSelect('multiplication-game');
  };

  const handleOpenKnowledgeMap = () => {
    // Placeholder - można rozszerzyć o rzeczywistą mapę wiedzy
    alert('Mapa Wiedzy będzie dostępna wkrótce! 🗺️');
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <GlobalHeader 
        title={`Witaj z powrotem, ${user?.name || 'Odkrywco'}! 🚀`}
        showBackButton={false}
      />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Główny układ dwukolumnowy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolumna lewa - 65% szerokości */}
            <div className="lg:col-span-2">
              <LeftColumn 
                timeRemaining={kokpitData.timeRemaining}
                mentorSession={kokpitData.mentorSession}
                currentLesson={kokpitData.currentLesson}
                onScheduleMentor={handleScheduleMentor}
                onContinueLesson={handleContinueLesson}
              />
            </div>
            
            {/* Kolumna prawa - 35% szerokości */}
            <div className="lg:col-span-1">
              <RightColumn 
                bestScore={kokpitData.bestScore}
                recentBadges={kokpitData.recentBadges}
                totalBadgeCount={kokpitData.totalBadgeCount}
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