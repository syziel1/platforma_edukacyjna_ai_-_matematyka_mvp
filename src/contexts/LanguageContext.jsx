import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  pl: {
    // Previous translations...
    'loginPrompt': 'Zaloguj się swoim kontem Google, aby rozpocząć naukę.',
    'loginError': 'Błąd logowania. Spróbuj ponownie.',
    'logout': 'Wyloguj się',
    'welcome': 'Witaj',
  },
  en: {
    // Previous translations...
    'loginPrompt': 'Sign in with your Google account to start learning.',
    'loginError': 'Login failed. Please try again.',
    'logout': 'Sign out',
    'welcome': 'Welcome',
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pl');

  const translate = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const switchLanguage = () => {
    setCurrentLanguage(prev => prev === 'pl' ? 'en' : 'pl');
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      translate, 
      switchLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};