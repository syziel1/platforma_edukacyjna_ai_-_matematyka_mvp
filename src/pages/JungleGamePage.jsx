import React from 'react';
import { useNavigate } from 'react-router-dom';
import JungleGame from '../components/JungleGame';
import { useTranslation } from 'react-i18next';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';

const JungleGamePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('jungleGame');
  const { stopLearning } = useGlobalTimer();

  // Stop learning timer when page is initially loaded
  // The game component will start the timer when the actual game starts
  React.useEffect(() => {
    stopLearning();
  }, [stopLearning]);

  const handleBack = () => {
    navigate('/cockpit');
  };

  return (
    <JungleGame 
      onBack={handleBack} 
      startWithModeSelector={true} 
    />
  );
};

export default JungleGamePage;