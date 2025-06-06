import React, { useState } from 'react';
import { Play, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import InteractiveVisualization from './InteractiveVisualization';
import { useLanguage } from '../contexts/LanguageContext';

const LessonContent = ({ currentStep, setCurrentStep }) => {
  const { t } = useLanguage();
  
  // State for answers
  const [answers, setAnswers] = useState({
    xCoordinate: '',
    yCoordinate: '',
    optimalDimensions: ''
  });
  
  const [feedback, setFeedback] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Correct answers for chicken coop problem (40m fence)
  const correctAnswers = {
    xCoordinate: 10, // x = -b/(2a) = -40/(-2) = 10
    yCoordinate: 10, // y = L - x = 20 - 10 = 10
    optimalDimensions: '10,0 × 10,0' // Square dimensions
  };

  const handleAnswerChange = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const checkAnswers = () => {
    const newFeedback = {};
    let allCorrect = true;

    // Check x coordinate
    const xAnswer = parseFloat(answers.xCoordinate.replace(',', '.'));
    if (isNaN(xAnswer)) {
      newFeedback.xCoordinate = {
        correct: false,
        message: 'Wprowadź liczbę'
      };
      allCorrect = false;
    } else if (Math.abs(xAnswer - correctAnswers.xCoordinate) <= 0.5) {
      newFeedback.xCoordinate = {
        correct: true,
        message: 'Poprawnie! ✅'
      };
    } else {
      newFeedback.xCoordinate = {
        correct: false,
        message: `Niepoprawnie. Prawidłowa odpowiedź: ${correctAnswers.xCoordinate} m`
      };
      allCorrect = false;
    }

    // Check y coordinate
    const yAnswer = parseFloat(answers.yCoordinate.replace(',', '.'));
    if (isNaN(yAnswer)) {
      newFeedback.yCoordinate = {
        correct: false,
        message: 'Wprowadź liczbę'
      };
      allCorrect = false;
    } else if (Math.abs(yAnswer - correctAnswers.yCoordinate) <= 0.5) {
      newFeedback.yCoordinate = {
        correct: true,
        message: 'Poprawnie! ✅'
      };
    } else {
      newFeedback.yCoordinate = {
        correct: false,
        message: `Niepoprawnie. Prawidłowa odpowiedź: ${correctAnswers.yCoordinate} m`
      };
      allCorrect = false;
    }

    // Check optimal dimensions
    const dimensionsAnswer = answers.optimalDimensions.toLowerCase().replace(/\s/g, '');
    const correctDimensions = correctAnswers.optimalDimensions.toLowerCase().replace(/\s/g, '');
    if (dimensionsAnswer === correctDimensions || dimensionsAnswer === '10×10' || dimensionsAnswer === '10x10') {
      newFeedback.optimalDimensions = {
        correct: true,
        message: 'Poprawnie! ✅'
      };
    } else {
      newFeedback.optimalDimensions = {
        correct: false,
        message: `Niepoprawnie. Prawidłowa odpowiedź: ${correctAnswers.optimalDimensions} metrów`
      };
      allCorrect = false;
    }

    setFeedback(newFeedback);
    setShowResults(true);

    // Show overall feedback
    if (allCorrect) {
      alert('🎉 Gratulacje! Wszystkie odpowiedzi są poprawne! Odkryłeś, że kwadrat daje największą powierzchnię!');
    } else {
      alert('📚 Niektóre odpowiedzi wymagają poprawy. Sprawdź wskazówki i spróbuj ponownie.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {t('step1Title')}
            </h3>
            <div className="rounded-lg aspect-video mb-4 bg-black">
              <video 
                controls 
                className="w-full h-full rounded-lg"
                poster="/videos/intro-kurnik-poster.jpg"
              >
                <source src="/videos/intro-kurnik.mp4" type="video/mp4" />
                <source src="/videos/intro-kurnik.webm" type="video/webm" />
                <div className="bg-text-color/90 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-2 opacity-70" />
                    <p className="text-sm opacity-70">Twoja przeglądarka nie obsługuje wideo</p>
                  </div>
                </div>
              </video>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
            >
              Dalej <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {t('step2Title')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <p className="leading-relaxed">
                Mamy do dyspozycji 40 metrów ogrodzenia. Chcemy zbudować prostokątny kurnik o jak największej powierzchni. Jakie powinny być jego wymiary?
              </p>
              <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 mt-4">
                <p className="text-sm text-accent-secondary">
                  💡 <strong>Wskazówka:</strong> Pomyśl o tym, jak zmienia się powierzchnia w zależności od proporcji boków. Czy jest jakiś kształt, który wydaje się dawać największą powierzchnię przy stałym obwodzie?
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
              >
                {t('understood')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <InteractiveVisualization />
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
              >
                {t('endExploration')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {t('step4Title')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <p className="leading-relaxed mb-4">
                Teraz przejdziemy do formalnego podejścia matematycznego. Problem można sformułować jako:
              </p>
              <div className="bg-bg-light p-4 rounded-md mb-4">
                <p className="font-mono text-sm text-text-color">
                  Znajdź maksimum funkcji: P(x) = x(L-x)<br/>
                  gdzie x to długość jednego boku, a L to połowa obwodu.
                </p>
              </div>
              <p className="leading-relaxed">
                Jest to funkcja kwadratowa, której wykres to parabola. Maksymalna wartość funkcji (czyli największa powierzchnia) znajduje się w wierzchołku tej paraboli.
                Współrzędna x wierzchołka paraboli o równaniu ax² + bx + c wynosi: x = -b / (2a).
                W naszym przypadku, po rozwinięciu P(x) = Lx - x², mamy a = -1, b = L, c = 0.
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
              >
                {t('goToFormal')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {t('step5Title')}
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  Krok 1: Oblicz współrzędną x wierzchołka (długość jednego boku)
                </label>
                <input
                  type="text"
                  value={answers.xCoordinate}
                  onChange={(e) => handleAnswerChange('xCoordinate', e.target.value)}
                  placeholder="x = -b / (2a) = ..."
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color ${
                    showResults 
                      ? feedback.xCoordinate?.correct 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-bg-neutral'
                  }`}
                />
                {showResults && feedback.xCoordinate && (
                  <p className={`text-xs mt-1 ${feedback.xCoordinate.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.xCoordinate.message}
                  </p>
                )}
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: L = 20 (połowa obwodu 40m), a = -1, b = 20
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  Krok 2: Oblicz długość drugiego boku
                </label>
                <input
                  type="text"
                  value={answers.yCoordinate}
                  onChange={(e) => handleAnswerChange('yCoordinate', e.target.value)}
                  placeholder="y = L - x = ..."
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color ${
                    showResults 
                      ? feedback.yCoordinate?.correct 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-bg-neutral'
                  }`}
                />
                {showResults && feedback.yCoordinate && (
                  <p className={`text-xs mt-1 ${feedback.yCoordinate.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.yCoordinate.message}
                  </p>
                )}
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: y = 20 - x
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  Krok 3: Podaj optymalne wymiary kurnika (x × y)
                </label>
                <input
                  type="text"
                  value={answers.optimalDimensions}
                  onChange={(e) => handleAnswerChange('optimalDimensions', e.target.value)}
                  placeholder="__ × __ metrów (np. 10,0 × 10,0)"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color ${
                    showResults 
                      ? feedback.optimalDimensions?.correct 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-bg-neutral'
                  }`}
                />
                {showResults && feedback.optimalDimensions && (
                  <p className={`text-xs mt-1 ${feedback.optimalDimensions.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.optimalDimensions.message}
                  </p>
                )}
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: Podstaw obliczone wartości x i y
                </p>
              </div>
            </div>

            {showResults && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Podsumowanie rozwiązania:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Współrzędna x wierzchołka: <strong>x = -20/(-2) = 10 m</strong></p>
                  <p>• Długość drugiego boku: <strong>y = 20 - 10 = 10 m</strong></p>
                  <p>• Optymalne wymiary: <strong>10,0 × 10,0 metrów</strong></p>
                  <p>• Maksymalna powierzchnia: <strong>100 m²</strong></p>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Wniosek matematyczny:</strong> Przy stałym obwodzie, kwadrat ma największą powierzchnię 
                    spośród wszystkich prostokątów. To uniwersalna zasada w problemach optymalizacyjnych!
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </button>
              <button
                onClick={checkAnswers}
                className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {t('checkAnswer')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderStep()}
    </div>
  );
};

export default LessonContent;