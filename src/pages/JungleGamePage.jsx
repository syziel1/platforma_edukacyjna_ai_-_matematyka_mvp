import React from 'react';
import { useNavigate } from 'react-router-dom';
import JungleGame from '../components/JungleGame';
import { useTranslation } from 'react-i18next';

const JungleGamePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('jungleGame');

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