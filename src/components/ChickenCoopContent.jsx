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
        message: 'Enter a number'
      };
      allCorrect = false;
    } else if (Math.abs(xAnswer - correctAnswers.xCoordinate) <= 0.5) {
      newFeedback.xCoordinate = {
        correct: true,
        message: 'Correct! ✅'
      };
    } else {
      newFeedback.xCoordinate = {
        correct: false,
        message: `Incorrect. Correct answer: ${correctAnswers.xCoordinate} m`
      };
      allCorrect = false;
    }

    // Check y coordinate
    const yAnswer = parseFloat(answers.yCoordinate.replace(',', '.'));
    if (isNaN(yAnswer)) {
      newFeedback.yCoordinate = {
        correct: false,
        message: 'Enter a number'
      };
      allCorrect = false;
    } else if (Math.abs(yAnswer - correctAnswers.yCoordinate) <= 0.5) {
      newFeedback.yCoordinate = {
        correct: true,
        message: 'Correct! ✅'
      };
    } else {
      newFeedback.yCoordinate = {
        correct: false,
        message: `Incorrect. Correct answer: ${correctAnswers.yCoordinate} m`
      };
      allCorrect = false;
    }

    // Check optimal dimensions
    const dimensionsAnswer = answers.optimalDimensions.toLowerCase().replace(/\s/g, '');
    const correctDimensions = correctAnswers.optimalDimensions.toLowerCase().replace(/\s/g, '');
    if (dimensionsAnswer === correctDimensions || dimensionsAnswer === '10×10' || dimensionsAnswer === '10x10') {
      newFeedback.optimalDimensions = {
        correct: true,
        message: 'Correct! ✅'
      };
    } else {
      newFeedback.optimalDimensions = {
        correct: false,
        message: `Incorrect. Correct answer: ${correctAnswers.optimalDimensions} meters`
      };
      allCorrect = false;
    }

    setFeedback(newFeedback);
    setShowResults(true);

    // Show overall feedback and advance if all correct
    if (allCorrect) {
      alert('🎉 Congratulations! All answers are correct! You discovered that a square gives the largest area!');
      // Move to next step only after correct answers
      setTimeout(() => {
        setCurrentStep(6); // Step 6 - Formula summary
      }, 1000);
    } else {
      alert('📚 Some answers need improvement. Check the hints and try again.');
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
                poster="/videos/chicken_coop-poster.jpg"
              >
                <source src="/videos/chicken_coop.mp4" type="video/mp4" />
                <source src="/videos/chicken_coop.webm" type="video/webm" />
                <div className="bg-text-color/90 rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-2 opacity-70" />
                    <p className="text-sm opacity-70">Your browser does not support video</p>
                  </div>
                </div>
              </video>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
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
                We have 40 meters of fencing available. We want to build a rectangular chicken coop with the largest possible area. What should its dimensions be?
              </p>
              <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 mt-4">
                <p className="text-sm text-accent-secondary">
                  💡 <strong>Hint:</strong> Think about how the area changes depending on the proportions of the sides. Is there a shape that seems to give the largest area with a constant perimeter?
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
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
                <ArrowLeft className="w-4 h-4" /> Back
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
                Now we'll move to a formal mathematical approach. The problem can be formulated as:
              </p>
              <div className="bg-bg-light p-4 rounded-md mb-4">
                <p className="font-mono text-sm text-text-color">
                  Find the maximum of the function: P(x) = x(L-x)<br/>
                  where x is the length of one side, and L is half the perimeter.
                </p>
              </div>
              <p className="leading-relaxed">
                This is a quadratic function whose graph is a parabola. The maximum value of the function (i.e., the largest area) is at the vertex of this parabola.
                The x-coordinate of the vertex of a parabola with equation ax² + bx + c is: x = -b / (2a).
                In our case, after expanding P(x) = Lx - x², we have a = -1, b = L, c = 0.
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
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
              Step 1: Calculate the x-coordinate of the vertex
            </h3>
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">📐 Formula for the x-coordinate of parabola vertex:</h4>
                <p className="font-mono text-blue-700 text-lg">x = -b / (2a)</p>
                <p className="text-sm text-blue-600 mt-2">
                  Where for function P(x) = Lx - x² we have: a = -1, b = L = 20, c = 0
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Task:</strong> Calculate the x-coordinate of the vertex (length of one side)
                </label>
                <input
                  type="text"
                  value={answers.xCoordinate}
                  onChange={(e) => handleAnswerChange('xCoordinate', e.target.value)}
                  placeholder="x = -b / (2a) = -20 / (2×(-1)) = ..."
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
                  Hint: L = 20 (half of 40m perimeter), a = -1, b = 20
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => {
                  if (answers.xCoordinate && parseFloat(answers.xCoordinate.replace(',', '.')) === 10) {
                    setCurrentStep(6);
                  } else {
                    alert('First provide the correct answer for the x-coordinate!');
                  }
                }}
                className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
              >
                Next step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              Step 2: Calculate the length of the second side
            </h3>
            <div className="space-y-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">📐 Formula for the second side:</h4>
                <p className="font-mono text-green-700 text-lg">y = L - x</p>
                <p className="text-sm text-green-600 mt-2">
                  Where L = 20 (half the perimeter), and x = {answers.xCoordinate || '10'} (from previous step)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Task:</strong> Calculate the length of the second side
                </label>
                <input
                  type="text"
                  value={answers.yCoordinate}
                  onChange={(e) => handleAnswerChange('yCoordinate', e.target.value)}
                  placeholder="y = L - x = 20 - 10 = ..."
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
                  Hint: y = 20 - x = 20 - 10
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(5)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => {
                  if (answers.yCoordinate && parseFloat(answers.yCoordinate.replace(',', '.')) === 10) {
                    setCurrentStep(7);
                  } else {
                    alert('First provide the correct answer for the second side length!');
                  }
                }}
                className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
              >
                Final step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              Step 3: Provide optimal chicken coop dimensions
            </h3>
            <div className="space-y-4 mb-6">
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-4">
                <h4 className="font-semibold text-purple-800 mb-2">🎯 Calculation summary:</h4>
                <p className="text-purple-700">
                  x = {answers.xCoordinate || '10'} m (first side)<br/>
                  y = {answers.yCoordinate || '10'} m (second side)
                </p>
                <p className="text-sm text-purple-600 mt-2">
                  Now provide the final chicken coop dimensions in format: x × y
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Task:</strong> Provide optimal chicken coop dimensions (x × y)
                </label>
                <input
                  type="text"
                  value={answers.optimalDimensions}
                  onChange={(e) => handleAnswerChange('optimalDimensions', e.target.value)}
                  placeholder="__ × __ meters (e.g. 10.0 × 10.0)"
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
                  Hint: Substitute the calculated values of x and y
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(6)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
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

      case 8:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              🎉 Congratulations! Task completed!
            </h3>
            
            {showResults && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Solution summary:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Vertex x-coordinate: <strong>x = -20/(-2) = 10 m</strong></p>
                  <p>• Second side length: <strong>y = 20 - 10 = 10 m</strong></p>
                  <p>• Optimal dimensions: <strong>10.0 × 10.0 meters</strong></p>
                  <p>• Maximum area: <strong>100 m²</strong></p>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Mathematical conclusion:</strong> With a constant perimeter, a square has the largest area 
                    among all rectangles. This is a universal principle in optimization problems!
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setCurrentStep(7)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to final step
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