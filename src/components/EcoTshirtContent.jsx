import React, { useState } from 'react';
import { Play, ArrowRight, ArrowLeft, CheckCircle, TrendingUp } from 'lucide-react';
import EcoTshirtSimulator from './EcoTshirtSimulator';
import { useLanguage } from '../contexts/LanguageContext';

const EcoTshirtContent = ({ currentStep, setCurrentStep }) => {
  const { t } = useLanguage();
  
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

  // Correct answers (calculated based on the business case)
  const correctAnswers = {
    maxQuantity: 47, // 1000 / (25 * 0.85) = 47.06, rounded down
    netPrice: 32.31, // 21.25 / (1 - 0.35) = 32.31
    grossPrice: 39.74, // 32.31 * 1.23 = 39.74
    revenue: 913.68, // 47 * (3/5) * 32.31 = 28.2 * 32.31 = 913.68
    profit: -86.32 // 913.68 - 1000 = -86.32 (loss)
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

    // Check each answer with tolerance
    Object.keys(correctAnswers).forEach(key => {
      const userAnswer = parseFloat(answers[key].replace(',', '.'));
      const correctAnswer = correctAnswers[key];
      const tolerance = Math.abs(correctAnswer * 0.05); // 5% tolerance
      
      if (isNaN(userAnswer)) {
        newFeedback[key] = {
          correct: false,
          message: t('enterNumber')
        };
        allCorrect = false;
      } else if (Math.abs(userAnswer - correctAnswer) <= tolerance) {
        newFeedback[key] = {
          correct: true,
          message: t('correct')
        };
      } else {
        newFeedback[key] = {
          correct: false,
          message: `${t('incorrect')} ${t('correctAnswer')}: ${correctAnswer.toFixed(2).replace('.', ',')}`
        };
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);
    setShowResults(true);

    // Show overall feedback
    if (allCorrect) {
      alert(t('congratulationsAllCorrect'));
    } else {
      alert(t('someAnswersNeedImprovement'));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-nav-bg" />
              {t('ecoTshirtIntro')}
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
                    <p className="text-sm opacity-70">{t('browserDoesNotSupportVideo')}</p>
                  </div>
                </div>
              </video>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">🌱 {t('startupEcoTshirt')}</h4>
              <p className="text-sm text-green-700 leading-relaxed">
                {t('startupDescription')}
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
              {t('ecoTshirtProblem')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-3">📊 {t('problemsToSolve')}:</h4>
                <div className="space-y-3 text-sm text-blue-700">
                  <div>
                    <strong>1. {t('budgetAndProduction')}:</strong> {t('budgetAndProductionDesc')}
                  </div>
                  <div>
                    <strong>2. {t('priceAndProfit')}:</strong> {t('priceAndProfitDesc')}
                  </div>
                  <div>
                    <strong>3. {t('salesAnalysis')}:</strong> {t('salesAnalysisDesc')}
                  </div>
                </div>
              </div>
              
              <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 mt-4">
                <h4 className="font-semibold text-accent-secondary mb-2">🧮 {t('mathematicalConcepts')}:</h4>
                <ul className="text-sm text-accent-secondary space-y-1">
                  <li>• {t('percentages')}</li>
                  <li>• {t('fractions')}</li>
                  <li>• {t('financialAnalysisBasics')}</li>
                  <li>• {t('dataInterpretation')}</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> {t('back')}
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
                <ArrowLeft className="w-4 h-4" /> {t('back')}
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
              {t('financialAnalysisAndFormulas')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <div className="bg-bg-light p-4 rounded-md mb-4">
                <h4 className="font-semibold mb-3">📈 {t('keyBusinessFormulas')}:</h4>
                <div className="space-y-2 font-mono text-sm text-text-color">
                  <p><strong>{t('costWithDiscount')}:</strong> {t('costWithDiscountFormula')}</p>
                  <p><strong>{t('margin')}:</strong> {t('marginFormula')}</p>
                  <p><strong>{t('grossPrice')}:</strong> {t('grossPriceFormula')}</p>
                  <p><strong>{t('revenue')}:</strong> {t('revenueFormula')}</p>
                  <p><strong>{t('profit')}:</strong> {t('profitFormula')}</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold mb-2 text-green-800">💡 {t('keyInsights')}:</h4>
                <ul className="text-sm text-green-700 leading-relaxed space-y-2">
                  <li>• <strong>{t('quantityDiscount')}</strong> {t('quantityDiscountDesc')}</li>
                  <li>• <strong>{t('margin35Percent')}</strong> {t('margin35PercentDesc')}</li>
                  <li>• <strong>{t('vat23Percent')}</strong> {t('vat23PercentDesc')}</li>
                  <li>• <strong>{t('salesAnalysis')}</strong> {t('salesAnalysisInsight')}</li>
                </ul>
              </div>

              <p className="leading-relaxed">
                {t('realBusinessConsiderations')}
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> {t('back')}
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
              >
                {t('goToTasks')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {t('practicalTasks')}
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>{t('task1')}:</strong> {t('task1Description')}
                </label>
                <input
                  type="text"
                  value={answers.maxQuantity}
                  onChange={(e) => handleAnswerChange('maxQuantity', e.target.value)}
                  placeholder={t('maxQuantityPlaceholder')}
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
                  {t('task1Hint')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>{t('task2')}:</strong> {t('task2Description')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={answers.netPrice}
                      onChange={(e) => handleAnswerChange('netPrice', e.target.value)}
                      placeholder={t('netPricePlaceholder')}
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
                      placeholder={t('grossPricePlaceholder')}
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
                  {t('task2Hint')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>{t('task3')}:</strong> {t('task3Description')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={answers.revenue}
                      onChange={(e) => handleAnswerChange('revenue', e.target.value)}
                      placeholder={t('revenuePlaceholder')}
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
                      placeholder={t('profitLossPlaceholder')}
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
                  {t('task3Hint')}
                </p>
              </div>
            </div>

            {showResults && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📋 {t('resultsSummary')}:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• {t('maxProduction')}: <strong>47 {t('tshirts')}</strong> (1000 ÷ 21,25 = 47,06)</p>
                  <p>• {t('netPrice')}: <strong>32,31 zł</strong> (21,25 ÷ 0,65 = 32,31)</p>
                  <p>• {t('grossPrice')}: <strong>39,74 zł</strong> (32,31 × 1,23 = 39,74)</p>
                  <p>• {t('revenue')}: <strong>913,68 zł</strong> (28 × 32,31 = 904,68)</p>
                  <p>• {t('result')}: <strong>{t('loss')} 86,32 zł</strong> (904,68 - 1000 = -95,32)</p>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 {t('businessConclusion')}:</strong> {t('businessConclusionText')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> {t('back')}
              </button>
              <button
                onClick={checkAnswers}
                className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {t('checkAnswers')}
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