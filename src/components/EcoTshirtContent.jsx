import React, { useState } from 'react';
import { Play, ArrowRight, ArrowLeft, CheckCircle, TrendingUp } from 'lucide-react';
import EcoTshirtSimulator from './EcoTshirtSimulator';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const EcoTshirtContent = ({ currentStep, setCurrentStep }) => {
  const { t } = useLanguage();
  const { t: tEco } = useTranslation('ecoTshirt');
  
  // State for answers
  const [answers, setAnswers] = useState({
    maxQuantity: '',
    netPrice: '',
    grossPrice: '',
    revenue: '',
    profit: ''
  });
  
  const [feedback, setFeedback] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Centralized calculation function to ensure consistency with simulator
  const calculateCorrectAnswers = () => {
    // Business parameters
    const budget = 1000;
    const baseCost = 25;
    const discountThreshold = 30;
    const discountRate = 0.15;
    const targetMargin = 0.35;
    const vatRate = 0.23;
    
    // Calculate unit cost with discount (since we'll order more than 30)
    const unitCost = baseCost * (1 - discountRate); // 21.25
    
    // Calculate maximum quantity
    const maxQuantity = Math.floor(budget / unitCost); // 47.06 -> 47
    
    // Calculate optimal selling price for target margin
    const netPrice = unitCost / (1 - targetMargin); // 21.25 / 0.65 = 32.69
    const grossPrice = netPrice * (1 + vatRate); // 32.69 * 1.23 = 40.21
    
    // Calculate sales results (3/5 sold)
    const soldQuantity = Math.floor(maxQuantity * (3/5)); // 47 * 0.6 = 28.2 -> 28
    const revenue = soldQuantity * netPrice; // 28 * 32.69 = 915.32
    const profit = revenue - budget; // 915.32 - 1000 = -84.68
    
    return {
      maxQuantity: maxQuantity, // 47
      netPrice: netPrice, // 32.69
      grossPrice: grossPrice, // 40.21
      revenue: revenue, // 915.32
      profit: profit // -84.68
    };
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
    
    // Get dynamically calculated correct answers
    const correctAnswers = calculateCorrectAnswers();

    // Check each answer with tolerance
    Object.keys(correctAnswers).forEach(key => {
      const userAnswer = parseFloat(answers[key].replace(',', '.'));
      const correctAnswer = correctAnswers[key];
      const tolerance = Math.abs(correctAnswer * 0.05); // 5% tolerance
      
      if (isNaN(userAnswer)) {
        newFeedback[key] = {
          correct: false,
          message: 'Wprowadź liczbę'
        };
        allCorrect = false;
      } else if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
        newFeedback[key] = {
          correct: true,
          message: 'Poprawnie! ✅'
        };
      } else {
        newFeedback[key] = {
          correct: false,
          message: `Niepoprawnie. Prawidłowa odpowiedź: ${correctAnswer.toFixed(2).replace('.', ',')}`
        };
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);
    setShowResults(true);

    // Show overall feedback
    if (allCorrect) {
      alert('🎉 Gratulacje! Wszystkie odpowiedzi są poprawne! Masz talent do biznesu!');
    } else {
      alert('📚 Niektóre odpowiedzi wymagają poprawy. Sprawdź wskazówki i spróbuj ponownie.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-nav-bg" />
              {tEco('ecoTshirtIntro')}
            </h3>
            <div className="rounded-lg aspect-video mb-4 bg-black">
              <video 
                autoPlay
                controls 
                className="w-full h-full rounded-lg"
                poster="/videos/intro-startup-poster.jpg"
              >
                <source src="/videos/intro-startup.mp4" type="video/mp4" />
                <source src="/videos/intro-startup.webm" type="video/webm" />
                <div className="bg-text-color/90 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-2 opacity-70" />
                    <p className="text-sm opacity-70">Twoja przeglądarka nie obsługuje wideo</p>
                  </div>
                </div>
              </video>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">🌱 Startup "Eko-Koszulka"</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                Zakładasz własny, mały startup produkujący ekologiczne koszulki z nadrukami generowanymi przez AI. 
                Musisz podejmować mądre decyzje finansowe, aby Twoja firma przetrwała pierwszy kwartał i zaczęła przynosić zyski.
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
            >
              {t('continue')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {tEco('ecoTshirtProblem')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-3">📊 Problemy do rozwiązania:</h4>
                <div className="space-y-3 text-sm text-blue-700">
                  <div>
                    <strong>1. Budżet i Produkcja:</strong> Masz 1000 zł budżetu. Koszt jednej koszulki to 25 zł, 
                    ale przy zamówieniu powyżej 30 sztuk dostawca oferuje 15% rabatu. Ile koszulek możesz maksymalnie wyprodukować?
                  </div>
                  <div>
                    <strong>2. Cena i Zysk:</strong> Chcesz, aby Twoja marża na każdej koszulce wynosiła 35%. 
                    Jaka powinna być cena sprzedaży netto i brutto (uwzględniając 23% VAT)?
                  </div>
                  <div>
                    <strong>3. Analiza Sprzedaży:</strong> Po pierwszym miesiącu sprzedałeś 3/5 wyprodukowanych koszulek. 
                    Ile sztuk zostało w magazynie? Jaki jest Twój przychód i zysk/strata do tej pory?
                  </div>
                </div>
              </div>
              
              <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 mt-4">
                <h4 className="font-semibold text-accent-secondary mb-2">🧮 Koncepcje matematyczne:</h4>
                <ul className="text-sm text-accent-secondary space-y-1">
                  <li>• Procenty (rabaty, marże, VAT)</li>
                  <li>• Ułamki zwykłe i dziesiętne</li>
                  <li>• Podstawy analizy finansowej (przychód, koszty, zysk)</li>
                  <li>• Interpretacja danych</li>
                </ul>
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
                className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
              >
                {t('startExploration')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <EcoTshirtSimulator />
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
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
              Analiza finansowa i wzory
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <div className="bg-bg-light p-4 rounded-md mb-4">
                <h4 className="font-semibold mb-3">📈 Kluczowe wzory biznesowe:</h4>
                <div className="space-y-2 font-mono text-sm text-text-color">
                  <p><strong>Koszt z rabatem:</strong> Koszt = Cena × (1 - Rabat%)</p>
                  <p><strong>Marża:</strong> Marża% = (Cena sprzedaży - Koszt) / Cena sprzedaży × 100%</p>
                  <p><strong>Cena brutto:</strong> Cena brutto = Cena netto × (1 + VAT%)</p>
                  <p><strong>Przychód:</strong> Przychód = Ilość sprzedana × Cena jednostkowa</p>
                  <p><strong>Zysk:</strong> Zysk = Przychód - Koszty całkowite</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold mb-2 text-green-800">💡 Kluczowe spostrzeżenia:</h4>
                <ul className="text-sm text-green-700 leading-relaxed space-y-2">
                  <li>• <strong>Rabat ilościowy</strong> znacząco wpływa na opłacalność produkcji</li>
                  <li>• <strong>Marża 35%</strong> oznacza, że koszt stanowi 65% ceny sprzedaży</li>
                  <li>• <strong>VAT 23%</strong> zwiększa cenę końcową dla klienta</li>
                  <li>• <strong>Analiza sprzedaży</strong> pokazuje rzeczywistą rentowność biznesu</li>
                </ul>
              </div>

              <p className="leading-relaxed">
                W prawdziwym biznesie musisz również uwzględnić koszty stałe (wynajem, marketing, 
                wynagrodzenia), sezonowość sprzedaży i konkurencję na rynku.
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
                className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
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
                  <strong>Zadanie 1:</strong> {tEco('task1')}
                </label>
                <input
                  type="text"
                  value={answers.maxQuantity}
                  onChange={(e) => handleAnswerChange('maxQuantity', e.target.value)}
                  placeholder="Maksymalna liczba koszulek = ..."
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color ${
                    showResults 
                      ? feedback.maxQuantity?.correct 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-bg-neutral'
                  }`}
                />
                {showResults && feedback.maxQuantity && (
                  <p className={`text-xs mt-1 ${feedback.maxQuantity.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.maxQuantity.message}
                  </p>
                )}
                <p className="text-xs text-text-color/60 mt-1">
                  {tEco('businessTip1')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 2:</strong> {tEco('task2')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={answers.netPrice}
                      onChange={(e) => handleAnswerChange('netPrice', e.target.value)}
                      placeholder="Cena netto = ... zł"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color ${
                        showResults 
                          ? feedback.netPrice?.correct 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                          : 'border-bg-neutral'
                      }`}
                    />
                    {showResults && feedback.netPrice && (
                      <p className={`text-xs mt-1 ${feedback.netPrice.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {feedback.netPrice.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={answers.grossPrice}
                      onChange={(e) => handleAnswerChange('grossPrice', e.target.value)}
                      placeholder="Cena brutto = ... zł"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color ${
                        showResults 
                          ? feedback.grossPrice?.correct 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                          : 'border-bg-neutral'
                      }`}
                    />
                    {showResults && feedback.grossPrice && (
                      <p className={`text-xs mt-1 ${feedback.grossPrice.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {feedback.grossPrice.message}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-text-color/60 mt-1">
                  {tEco('businessTip2')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 3:</strong> {tEco('task3')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={answers.revenue}
                      onChange={(e) => handleAnswerChange('revenue', e.target.value)}
                      placeholder="Przychód = ... zł"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color ${
                        showResults 
                          ? feedback.revenue?.correct 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                          : 'border-bg-neutral'
                      }`}
                    />
                    {showResults && feedback.revenue && (
                      <p className={`text-xs mt-1 ${feedback.revenue.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {feedback.revenue.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={answers.profit}
                      onChange={(e) => handleAnswerChange('profit', e.target.value)}
                      placeholder="Zysk/Strata = ... zł"
                      className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color ${
                        showResults 
                          ? feedback.profit?.correct 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                          : 'border-bg-neutral'
                      }`}
                    />
                    {showResults && feedback.profit && (
                      <p className={`text-xs mt-1 ${feedback.profit.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {feedback.profit.message}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-text-color/60 mt-1">
                  {tEco('businessTip3')}
                </p>
              </div>
            </div>

            {showResults && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Podsumowanie wyników:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Maksymalna produkcja: <strong>47 koszulek</strong> (1000 ÷ 21,25 = 47,06)</p>
                  <p>• Cena netto: <strong>32,69 zł</strong> (21,25 ÷ 0,65 = 32,69)</p>
                  <p>• Cena brutto: <strong>40,21 zł</strong> (32,69 × 1,23 = 40,21)</p>
                  <p>• Przychód: <strong>915,32 zł</strong> (28 × 32,69 = 915,32)</p>
                  <p>• Wynik: <strong>Strata 84,68 zł</strong> (915,32 - 1000 = -84,68)</p>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 {tEco('businessConclusion')}</strong>
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

export default EcoTshirtContent;