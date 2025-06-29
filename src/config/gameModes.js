import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

// Game mode configurations
export const createGameModeConfig = (t) => ({
  addition: {
    name: t('addition'),
    symbol: '+',
    generateQuestion: (r, c) => ({
      num1: r + 1,
      num2: c + 1,
      operation: 'addition',
      answer: (r + 1) + (c + 1),
      display: `${r + 1} + ${c + 1}`
    })
  },
  subtraction: {
    name: t('subtraction'), 
    symbol: '-',
    generateQuestion: (r, c) => {
      const num1 = Math.max(r + 1, c + 1) + Math.floor(Math.random() * 5);
      const num2 = Math.min(r + 1, c + 1);
      return {
        num1,
        num2,
        operation: 'subtraction',
        answer: num1 - num2,
        display: `${num1} - ${num2}`
      };
    }
  },
  multiplication: {
    name: t('multiplication'),
    symbol: '×',
    generateQuestion: (r, c) => ({
      num1: r + 1,
      num2: c + 1,
      operation: 'multiplication',
      answer: (r + 1) * (c + 1),
      display: `${r + 1} × ${c + 1}`
    })
  },
  division: {
    name: t('division'),
    symbol: '÷',
    generateQuestion: (r, c) => {
      const divisor = Math.max(1, Math.min(r + 1, c + 1));
      const quotient = Math.max(r + 1, c + 1);
      const dividend = divisor * quotient;
      return {
        num1: dividend,
        num2: divisor,
        operation: 'division',
        answer: quotient,
        display: `${dividend} ÷ ${divisor}`
      };
    }
  },
  exponentiation: {
    name: t('exponentiation'),
    symbol: '^',
    generateQuestion: (r, c) => {
      const base = Math.max(2, Math.min(r + 1, c + 1, 5));
      const exponent = Math.max(1, Math.min(Math.max(r, c), 3));
      return {
        num1: base,
        num2: exponent,
        operation: 'exponentiation',
        answer: Math.pow(base, exponent),
        display: `${base}^${exponent}`
      };
    }
  },
  'square-root': {
    name: t('squareRoot'),
    symbol: '√',
    generateQuestion: (r, c) => {
      const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
      const maxIndex = Math.min(perfectSquares.length - 1, Math.max(r, c) + 2);
      const randomSquare = perfectSquares[Math.min(maxIndex, perfectSquares.length - 1)];
      return {
        num1: randomSquare,
        num2: null,
        operation: 'square-root',
        answer: Math.sqrt(randomSquare),
        display: `√${randomSquare}`
      };
    }
  }
});

// Hook to get game mode configuration with translations
export const useGameModeConfig = () => {
  const { t: tJungle } = useTranslation('jungleGame');
  return createGameModeConfig(tJungle);
};