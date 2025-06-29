import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../components/GlobalHeader';
import PowersRoots from '../components/Formulas/PowersRoots';
import { useTranslation } from 'react-i18next';

const PowersRootsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleBack = () => {
    navigate('/cockpit');
  };

  return (
    <div className="flex-1 flex flex-col">
      <GlobalHeader 
        title={t('powersRootsTitle')}
        onBack={handleBack}
        showBackButton={true}
      />
      <div className="flex-1 overflow-y-auto mt-16">
        <PowersRoots />
      </div>
    </div>
  );
};

export default PowersRootsPage;