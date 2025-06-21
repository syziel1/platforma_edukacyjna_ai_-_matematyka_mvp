import React from 'react';
import { useNavigate } from 'react-router-dom';
import JungleGame from '../components/JungleGame';

const JungleGamePage = () => {
  const navigate = useNavigate();

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