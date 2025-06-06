import React, { useState } from 'react';
import { Play, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import WaterTankVisualization from './WaterTankVisualization';
import { useLanguage } from '../contexts/LanguageContext';

const WaterTankContent = ({ currentStep, setCurrentStep }) => {
  const { t } = useLanguage();
  
  // State for answers
  const [answers, setAnswers] = useState({
    radiusDerivative: '',
    heightDerivative: '',
    optimalProportions: ''
  });
  
  const [feedback, setFeedback] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Correct answers for water tank optimization
  const correctAnswers = {
    radiusDerivative: 'dV/dr = 2πrh - 2πr²/h', // Simplified form
    heightDerivative: 'dV/dh = πr² - 2πr²/h²', // Simplified form  
    optimalProportions: 'h = 2r' // Height equals diameter
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

    // Check radius derivative (simplified check)
    const radiusAnswer = answers.radiusDerivative.toLowerCase().replace(/\s/g, '');
    if (radiusAnswer.includes('2πrh') || radiusAnswer.includes('h=2r') || radiusAnswer.includes('2r')) {
      newFeedback.radiusDerivative = {
        correct: true,
        message: 'Poprawnie! ✅'
      };
    } else {
      newFeedback.radiusDerivative = {
        correct: false,
        message: 'Niepoprawnie. Wskazówka: Rozważ relację między r i h w optymalnym zbiorniku'
      };
      allCorrect = false;
    }

    // Check height derivative (simplified check)
    const heightAnswer = answers.heightDerivative.toLowerCase().replace(/\s/g, '');
    if (heightAnswer.includes('πr²') || heightAnswer.includes('h=2r') || heightAnswer.includes('2r')) {
      newFeedback.heightDerivative = {
        correct: true,
        message: 'Poprawnie! ✅'
      };
    } else {
      newFeedback.heightDerivative = {
        correct: false,
        message: 'Niepoprawnie. Wskazówka: Rozważ jak wysokość wpływa na objętość'
      };
      allCorrect = false;
    }

    // Check optimal proportions
    const proportionsAnswer = answers.optimalProportions.toLowerCase().replace(/\s/g, '');
    if (proportionsAnswer.includes('h=2r') || proportionsAnswer.includes('h/r=2') || proportionsAnswer === '2') {
      newFeedback.optimalProportions = {
        correct: true,
        message: 'Poprawnie! ✅'
      };
    } else {
      newFeedback.optimalProportions = {
        correct: false,
        message: 'Niepoprawnie. Prawidłowa odpowiedź: h = 2r (wysokość = średnica)'
      };
      allCorrect = false;
    }

    setFeedback(newFeedback);
    setShowResults(true);

    // Show overall feedback
    if (allCorrect) {
      alert('🎉 Gratulacje! Odkryłeś optymalną proporcję zbiornika: wysokość = średnica podstawy!');
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
              {t('waterTankIntro')}
            </h3>
            <div className="bg-text-color/90 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-2 opacity-70" />
                <p className="text-sm opacity-70">Video placeholder</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
            >
              {t('continue')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {t('waterTankProblem')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <p className="leading-relaxed mb-4">
                Firma produkująca zbiorniki na wodę chce zoptymalizować swoje produkty. 
                Mają ograniczoną ilość materiału na każdy zbiornik i chcą, żeby zbiornik 
                pomieścił jak najwięcej wody.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>Zadanie:</strong> Znajdź najlepsze proporcje cylindrycznego zbiornika 
                  (stosunek wysokości do promienia), żeby zmieścił jak najwięcej wody przy 
                  ograniczonej ilości materiału.
                </p>
              </div>
              <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 mt-4">
                <p className="text-sm text-accent-secondary">
                  💡 <strong>{t('hint')}:</strong> Pomyśl o tym, jak zmienia się objętość 
                  w zależności od proporcji wysokości do promienia. Czy zbiornik powinien być 
                  wysoki i wąski, czy niski i szeroki?
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
                {t('startExploration')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <WaterTankVisualization />
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
              Analiza geometryczna
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <p className="leading-relaxed mb-4">
                Teraz przeanalizujmy problem geometrycznie, bez używania pochodnych.
              </p>
              
              <div className="bg-bg-light p-4 rounded-md mb-4">
                <h4 className="font-semibold mb-2">Wzory podstawowe:</h4>
                <p className="font-mono text-sm text-text-color mb-2">
                  <strong>Objętość cylindra:</strong> V = π × r² × h
                </p>
                <p className="font-mono text-sm text-text-color mb-2">
                  <strong>Powierzchnia materiału:</strong> A = 2πr² + 2πrh
                </p>
                <p className="text-sm text-text-color/70">
                  gdzie r = promień podstawy, h = wysokość
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold mb-2 text-green-800">Kluczowe spostrzeżenie:</h4>
                <p className="text-sm text-green-700 leading-relaxed">
                  Gdy mamy stałą ilość materiału, najlepsze proporcje to gdy <strong>wysokość 
                  równa się średnicy podstawy</strong> (h = 2r). To oznacza, że zbiornik 
                  powinien być "kwadratowy" w przekroju pionowym.
                </p>
              </div>

              <p className="leading-relaxed">
                To można sprawdzić eksperymentalnie lub przez porównanie różnych proporcji. 
                Zbiorniki zbyt wysokie mają małą podstawę, a zbyt płaskie mają za dużą powierzchnię 
                górną i dolną w stosunku do objętości.
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
                Przejdź do zadań <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              Zadania praktyczne
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 1:</strong> Opisz matematycznie, jak zmienia się objętość względem promienia 
                  (możesz użyć intuicji geometrycznej zamiast pochodnych)
                </label>
                <input
                  type="text"
                  value={answers.radiusDerivative}
                  onChange={(e) => handleAnswerChange('radiusDerivative', e.target.value)}
                  placeholder="Opisz relację między r a V..."
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color ${
                    showResults 
                      ? feedback.radiusDerivative?.correct 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-bg-neutral'
                  }`}
                />
                {showResults && feedback.radiusDerivative && (
                  <p className={`text-xs mt-1 ${feedback.radiusDerivative.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.radiusDerivative.message}
                  </p>
                )}
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: Większy promień = większa podstawa, ale mniej materiału na wysokość
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 2:</strong> Opisz matematycznie, jak zmienia się objętość względem wysokości
                </label>
                <input
                  type="text"
                  value={answers.heightDerivative}
                  onChange={(e) => handleAnswerChange('heightDerivative', e.target.value)}
                  placeholder="Opisz relację między h a V..."
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color ${
                    showResults 
                      ? feedback.heightDerivative?.correct 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-bg-neutral'
                  }`}
                />
                {showResults && feedback.heightDerivative && (
                  <p className={`text-xs mt-1 ${feedback.heightDerivative.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.heightDerivative.message}
                  </p>
                )}
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: Większa wysokość = większa objętość, ale mniejszy promień podstawy
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 3:</strong> Jaka jest optymalna relacja między wysokością a promieniem?
                </label>
                <input
                  type="text"
                  value={answers.optimalProportions}
                  onChange={(e) => handleAnswerChange('optimalProportions', e.target.value)}
                  placeholder="h = ? × r"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color ${
                    showResults 
                      ? feedback.optimalProportions?.correct 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-bg-neutral'
                  }`}
                />
                {showResults && feedback.optimalProportions && (
                  <p className={`text-xs mt-1 ${feedback.optimalProportions.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.optimalProportions.message}
                  </p>
                )}
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: Pomyśl o "kwadratowym" przekroju pionowym zbiornika
                </p>
              </div>
            </div>

            {showResults && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Podsumowanie rozwiązania:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Optymalna relacja: <strong>h = 2r</strong> (wysokość = średnica)</p>
                  <p>• Przykład: jeśli r = 3m, to h = 6m</p>
                  <p>• Objętość takiego zbiornika: <strong>V = π × 3² × 6 = 54π ≈ 169,6 m³</strong></p>
                  <p>• Powierzchnia materiału: <strong>A = 2π × 3² + 2π × 3 × 6 = 54π ≈ 169,6 m²</strong></p>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Wniosek inżynierski:</strong> Zbiornik o proporcjach h = 2r wykorzystuje materiał 
                    najefektywniej, maksymalizując objętość przy minimalnym zużyciu materiału. 
                    To dlatego wiele rzeczywistych zbiorników ma podobne proporcje!
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

export default WaterTankContent;