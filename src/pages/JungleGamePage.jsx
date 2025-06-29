import React from 'react';
import { useNavigate } from 'react-router-dom';
import JungleGame from '../components/JungleGame';
import { useTranslation } from 'react-i18next';
import { useGlobalTimer } from '../contexts/GlobalTimerContext';

const JungleGamePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('jungleGame');
  const { stopLearning } = useGlobalTimer();

  React.useEffect(() => {
    // Stop learning timer when landing page is opened
    stopLearning();
    return () => {};
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