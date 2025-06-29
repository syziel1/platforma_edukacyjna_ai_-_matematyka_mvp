import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common';
import plCommon from './locales/pl/common';
import enEcoTshirt from './locales/en/ecoTshirt';
import plEcoTshirt from './locales/pl/ecoTshirt';
import enChickenCoop from './locales/en/chickenCoop';
import plChickenCoop from './locales/pl/chickenCoop';
import enWaterTank from './locales/en/waterTank';
import plWaterTank from './locales/pl/waterTank';
import enJungleGame from './locales/en/jungleGame';
import plJungleGame from './locales/pl/jungleGame';

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        ecoTshirt: enEcoTshirt,
        chickenCoop: enChickenCoop,
        waterTank: enWaterTank,
        jungleGame: enJungleGame
      },
      pl: {
        common: plCommon,
        ecoTshirt: plEcoTshirt,
        chickenCoop: plChickenCoop,
        waterTank: plWaterTank,
        jungleGame: plJungleGame
      }
    },
    fallbackLng: 'pl',
    debug: false,
    
    // Have a common namespace used around the full app
    ns: ['common', 'ecoTshirt', 'chickenCoop', 'waterTank', 'jungleGame'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;