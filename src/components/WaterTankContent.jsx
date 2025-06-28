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

  // Improved answer validation functions
  const validateRadiusDerivative = (answer) => {
    const cleanAnswer = answer.toLowerCase().replace(/\s/g, '');
    
    // Accept various correct formulations
    const correctPatterns = [
      /h\s*=\s*2\s*r/,           // h = 2r
      /h\s*=\s*2\*r/,            // h = 2*r
      /wysokość\s*=\s*2\s*\*\s*promień/,
      /wysokość\s*równa\s*się\s*średnicy/,
      /h\s*równa\s*się\s*2r/,
      /2\s*r/,                   // Just "2r"
      /dwukrotność\s*promienia/,
      /wysokość\s*to\s*podwojony\s*promień/,
      /height\s*=\s*2\s*radius/,
      /height\s*equals\s*diameter/,
      /height\s*is\s*twice\s*radius/
    ];
    
    return correctPatterns.some(pattern => pattern.test(cleanAnswer));
  };

  const validateHeightDerivative = (answer) => {
    const cleanAnswer = answer.toLowerCase().replace(/\s/g, '');
    
    // Accept various correct formulations
    const correctPatterns = [
      /h\s*=\s*2\s*r/,
      /wysokość\s*wpływa\s*na\s*objętość/,
      /większa\s*wysokość.*większa\s*objętość/,
      /πr²/,                     // Mathematical formula fragment
      /pi\s*r\s*kwadrat/,
      /powierzchnia\s*podstawy/,
      /2\s*r/,
      /height\s*affects\s*volume/,
      /larger\s*height.*larger\s*volume/,
      /base\s*area/
    ];
    
    return correctPatterns.some(pattern => pattern.test(cleanAnswer));
  };

  const validateOptimalProportions = (answer) => {
    const cleanAnswer = answer.toLowerCase().replace(/\s/g, '');
    
    // More rigorous validation for optimal proportions
    const correctPatterns = [
      /^h\s*=\s*2\s*r$/,         // Exact: h = 2r
      /^h\s*=\s*2\*r$/,          // Exact: h = 2*r
      /^2\s*r$/,                 // Exact: 2r
      /^2$/,                     // Just the number 2
      /^h\/r\s*=\s*2$/,          // h/r = 2
      /^wysokość\s*=\s*średnica$/,
      /^wysokość\s*=\s*2\s*promień$/,
      /^height\s*=\s*diameter$/,
      /^height\s*=\s*2\s*radius$/
    ];
    
    // Also check for numeric ratio
    const numericMatch = cleanAnswer.match(/(\d+(?:\.\d+)?)/);
    if (numericMatch) {
      const value = parseFloat(numericMatch[1]);
      return Math.abs(value - 2) < 0.1; // Allow small tolerance
    }
    
    return correctPatterns.some(pattern => pattern.test(cleanAnswer));
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

    // Check radius derivative with improved validation
    if (!answers.radiusDerivative.trim()) {
      newFeedback.radiusDerivative = {
        correct: false,
        message: t('pleaseProvideAnswer')
      };
      allCorrect = false;
    } else if (validateRadiusDerivative(answers.radiusDerivative)) {
      newFeedback.radiusDerivative = {
        correct: true,
        message: t('correct')
      };
    } else {
      newFeedback.radiusDerivative = {
        correct: false,
        message: t('incorrectRadiusHint')
      };
      allCorrect = false;
    }

    // Check height derivative with improved validation
    if (!answers.heightDerivative.trim()) {
      newFeedback.heightDerivative = {
        correct: false,
        message: t('pleaseProvideAnswer')
      };
      allCorrect = false;
    } else if (validateHeightDerivative(answers.heightDerivative)) {
      newFeedback.heightDerivative = {
        correct: true,
        message: t('correct')
      };
    } else {
      newFeedback.heightDerivative = {
        correct: false,
        message: t('incorrectHeightHint')
      };
      allCorrect = false;
    }

    // Check optimal proportions with strict validation
    if (!answers.optimalProportions.trim()) {
      newFeedback.optimalProportions = {
        correct: false,
        message: t('pleaseProvideAnswer')
      };
      allCorrect = false;
    } else if (validateOptimalProportions(answers.optimalProportions)) {
      newFeedback.optimalProportions = {
        correct: true,
        message: t('correct')
      };
    } else {
      newFeedback.optimalProportions = {
        correct: false,
        message: t('incorrectProportionsHint')
      };
      allCorrect = false;
    }

    setFeedback(newFeedback);
    setShowResults(true);

    // Show overall feedback
    if (allCorrect) {
      alert(t('congratulationsOptimalTank'));
    } else {
      alert(t('someAnswersNeedImprovement'));
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
            <div className="rounded-lg aspect-video mb-4 bg-black">
              <video 
                controls 
                className="w-full h-full rounded-lg"
                poster="/videos/intro-zbiornik-poster.jpg"
              >
                <source src="/videos/intro-zbiornik.mp4" type="video/mp4" />
                <source src="/videos/intro-zbiornik.webm" type="video/webm" />
                <div className="bg-text-color/90 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-2 opacity-70" />
                    <p className="text-sm opacity-70">{t('browserDoesNotSupportVideo')}</p>
                  </div>
                </div>
              </video>
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
                {t('waterTankDescription')}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>{t('task')}:</strong> {t('findOptimalTankProportions')}
                </p>
              </div>
              <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 mt-4">
                <p className="text-sm text-accent-secondary">
                  💡 <strong>{t('hint')}:</strong> {t('waterTankHint')}
                </p>
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
                <ArrowLeft className="w-4 h-4" /> {t('back')}
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
              {t('geometricAnalysis')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <p className="leading-relaxed mb-4">
                {t('geometricAnalysisDescription')}
              </p>
              
              <div className="bg-bg-light p-4 rounded-md mb-4">
                <h4 className="font-semibold mb-2">{t('basicFormulas')}:</h4>
                <p className="font-mono text-sm text-text-color mb-2">
                  <strong>{t('cylinderVolume')}:</strong> V = π × r² × h
                </p>
                <p className="font-mono text-sm text-text-color mb-2">
                  <strong>{t('materialSurface')}:</strong> A = 2πr² + 2πrh
                </p>
                <p className="text-sm text-text-color/70">
                  {t('whereFormula')}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold mb-2 text-green-800">{t('keyInsight')}:</h4>
                <p className="text-sm text-green-700 leading-relaxed">
                  {t('keyInsightText')}
                </p>
              </div>

              <p className="leading-relaxed">
                {t('experimentalVerification')}
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
                className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
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
                  <strong>{t('task1')}:</strong> {t('describeRelationshipRadiusVolume')}
                </label>
                <input
                  type="text"
                  value={answers.radiusDerivative}
                  onChange={(e) => handleAnswerChange('radiusDerivative', e.target.value)}
                  placeholder={t('describeRelationshipPlaceholder')}
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
                  {t('hintLargerRadius')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>{t('task2')}:</strong> {t('describeRelationshipHeightVolume')}
                </label>
                <input
                  type="text"
                  value={answers.heightDerivative}
                  onChange={(e) => handleAnswerChange('heightDerivative', e.target.value)}
                  placeholder={t('describeRelationshipPlaceholder')}
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
                  {t('hintLargerHeight')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>{t('task3')}:</strong> {t('provideOptimalProportions')}
                </label>
                <input
                  type="text"
                  value={answers.optimalProportions}
                  onChange={(e) => handleAnswerChange('optimalProportions', e.target.value)}
                  placeholder={t('optimalProportionsPlaceholder')}
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
                  {t('hintSquareCrossSection')}
                </p>
              </div>
            </div>

            {showResults && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📋 {t('solutionSummary')}:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• {t('optimalRelation')}: <strong>h = 2r</strong> ({t('heightEqualsDiameter')})</p>
                  <p>• {t('exampleDimensions')}</p>
                  <p>• {t('volumeCalculation')}: <strong>V = π × 3² × 6 = 54π ≈ 169,6 m³</strong></p>
                  <p>• {t('surfaceAreaCalculation')}: <strong>A = 2π × 3² + 2π × 3 × 6 = 54π ≈ 169,6 m²</strong></p>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 {t('engineeringConclusion')}:</strong> {t('engineeringConclusionText')}
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