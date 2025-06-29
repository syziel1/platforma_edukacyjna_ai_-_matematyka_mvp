import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginScreen = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/cockpit');
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <div className="bg-bg-card p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h1 className="text-xl font-bold text-text-color mb-6 text-center">
          {t('welcomeTitle')}
        </h1>
        <p className="text-text-color/70 mb-8 text-center">
          Strona logowania została zastąpiona nowym systemem autentykacji.
          Przejdź do nowej strony logowania.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-accent-primary text-white py-3 px-4 rounded-lg hover:bg-accent-primary/90 transition-colors font-medium"
          >
            Przejdź do logowania
          </button>
          <button
            onClick={handleSkip}
            className="text-text-color hover:text-accent-primary transition-colors"
          >
            {t('skipLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;