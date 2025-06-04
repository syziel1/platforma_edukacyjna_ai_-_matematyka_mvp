import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginScreen = ({ onSkip }) => {
  const { login } = useAuth();
  const { translate } = useLanguage();

  const handleSuccess = (credentialResponse) => {
    const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
    login({
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture
    });
    onSkip();
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <div className="bg-bg-card p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h1 className="text-xl font-bold text-text-color mb-6 text-center">
          {translate('welcomeTitle')}
        </h1>
        <p className="text-text-color/70 mb-8 text-center">
          {translate('loginPrompt')}
        </p>
        <div className="flex flex-col items-center gap-4">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
          />
          <button
            onClick={onSkip}
            className="text-text-color hover:text-accent-primary transition-colors"
          >
            {translate('skipLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};