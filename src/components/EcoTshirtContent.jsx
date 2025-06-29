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
          message: tEco('enterNumber')
        };
        allCorrect = false;
      } else if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
        newFeedback[key] = {
          correct: true,
          message: tEco('correct')
        };
      } else {
        newFeedback[key] = {
          correct: false,
          message: `${tEco('incorrect')} ${correctAnswer.toFixed(2).replace('.', ',')}`
        };
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);
    setShowResults(true);

    // Show overall feedback
    if (allCorrect) {
      alert(tEco('allCorrect'));
    } else {
      alert(tEco('someIncorrect'));
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
                    <p className="text-sm opacity-70">{tEco('browserNotSupport')}</p>
                  </div>
                </div>
              </video>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">🌱 {tEco('startupName')}</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                {tEco('startupDescription')}
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
                <h4 className="font-semibold text-blue-800 mb-3">{tEco('problemsToSolve')}:</h4>
                <div className="space-y-3 text-sm text-blue-700">
                  <div>
                    <strong>1. {tEco('budgetAndProduction')}:</strong> {tEco('budgetAndProductionDesc')}
                  </div>
                  <div>
                    <strong>2. {tEco('priceAndProfit')}:</strong> {tEco('priceAndProfitDesc')}
                  </div>
                  <div>
                    <strong>3. {tEco('salesAnalysis')}:</strong> {tEco('salesAnalysisDesc')}
                  </div>
                </div>
              </div>
              
              <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 mt-4">
                <h4 className="font-semibold text-accent-secondary mb-2">🧮 {tEco('mathConcepts')}:</h4>
                <ul className="text-sm text-text-color space-y-1">
                  <li>• {tEco('percentages')}</li>
                  <li>• {tEco('fractions')}</li>
                  <li>• {tEco('financialAnalysis')}</li>
                  <li>• {tEco('dataInterpretation')}</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> {tEco('back')}
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
                <ArrowLeft className="w-4 h-4" /> {tEco('back')}
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
              {tEco('financialAnalysisAndFormulas')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <div className="bg-bg-light p-4 rounded-md mb-4">
                <h4 className="font-semibold mb-3">📈 {tEco('keyBusinessFormulas')}:</h4>
                <div className="space-y-2 font-mono text-sm text-text-color">
                  <p><strong>{tEco('discountedCost')}:</strong> {tEco('discountedCostFormula')}</p>
                  <p><strong>{tEco('margin')}:</strong> {tEco('marginFormula')}</p>
                  <p><strong>{tEco('grossPrice')}:</strong> {tEco('grossPriceFormula')}</p>
                  <p><strong>{tEco('revenue')}:</strong> {tEco('revenueFormula')}</p>
                  <p><strong>{tEco('profit')}:</strong> {tEco('profitFormula')}</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold mb-2 text-green-800">💡 {tEco('keyInsights')}:</h4>
                <ul className="text-sm text-green-700 leading-relaxed space-y-2">
                  <li>• <strong>{tEco('quantityDiscount')}</strong> {tEco('quantityDiscountEffect')}</li>
                  <li>• <strong>{tEco('margin35')}</strong> {tEco('margin35Meaning')}</li>
                  <li>• <strong>{tEco('vat23')}</strong> {tEco('vat23Effect')}</li>
                  <li>• <strong>{tEco('salesAnalysis')}</strong> {tEco('salesAnalysisShows')}</li>
                </ul>
              </div>

              <p className="leading-relaxed">
                {tEco('realBusinessConsiderations')}
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> {tEco('back')}
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
              >
                {tEco('goToTasks')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {tEco('practicalTasks')}
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>{tEco('task')} 1:</strong> {tEco('task1')}
                </label>
                <input
                  type="text"
                  value={answers.maxQuantity}
                  onChange={(e) => handleAnswerChange('maxQuantity', e.target.value)}
                  placeholder={tEco('maxQuantityPlaceholder')}
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
                  <strong>{tEco('task')} 2:</strong> {tEco('task2')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={answers.netPrice}
                      onChange={(e) => handleAnswerChange('netPrice', e.target.value)}
                      placeholder={tEco('netPricePlaceholder')}
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
                      placeholder={tEco('grossPricePlaceholder')}
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
                  <strong>{tEco('task')} 3:</strong> {tEco('task3')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={answers.revenue}
                      onChange={(e) => handleAnswerChange('revenue', e.target.value)}
                      placeholder={tEco('revenuePlaceholder')}
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
                      placeholder={tEco('profitLossPlaceholder')}
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
                <h4 className="font-semibold text-blue-800 mb-2">📋 {tEco('resultsSummary')}:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• {tEco('maxProduction')}: <strong>47 {tEco('pieces')}</strong> (1000 ÷ 21,25 = 47,06)</p>
                  <p>• {tEco('netPrice')}: <strong>32,69 zł</strong> (21,25 ÷ 0,65 = 32,69)</p>
                  <p>• {tEco('grossPrice')}: <strong>40,21 zł</strong> (32,69 × 1,23 = 40,21)</p>
                  <p>• {tEco('revenue')}: <strong>915,32 zł</strong> (28 × 32,69 = 915,32)</p>
                  <p>• {tEco('result')}: <strong>{tEco('loss')} 84,68 zł</strong> (915,32 - 1000 = -84,68)</p>
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
                <ArrowLeft className="w-4 h-4" /> {tEco('back')}
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