import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales';

// Function to detect user's language based on location
const detectUserLanguage = () => {
  // Priority 1: Check for language parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const langFromUrl = urlParams.get('lang');
  if (langFromUrl && (langFromUrl === 'pl' || langFromUrl === 'en')) {
    return langFromUrl;
  }
  // Priority 2: Check if user has a saved preference
  const savedLanguage = localStorage.getItem('userLanguage');
  if (savedLanguage && (savedLanguage === 'pl' || savedLanguage === 'en')) {
    return savedLanguage;
  }
  // Priority 3: Default to English for global audience
  return 'en';
};

// Create the Language Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => detectUserLanguage());

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('userLanguage', language);
  }, [language]);

  const switchLanguage = () => {
    setLanguage(prevLang => prevLang === 'pl' ? 'en' : 'pl');
  };

  const setLanguageDirectly = (newLanguage) => {
    if (newLanguage === 'pl' || newLanguage === 'en') {
      setLanguage(newLanguage);
    }
  };

  const t = (key, params = {}) => {
    let translation = translations[language][key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
  };

  const value = {
    language,
    currentLanguage: language,
    setLanguage: setLanguageDirectly,
    switchLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the Language Context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};