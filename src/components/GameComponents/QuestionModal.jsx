import React, { useState, useEffect } from 'react';

const QuestionModal = ({ 
  question, 
  onAnswer, 
  wrongAnswersCount, 
  isGeminiLoading,
  onAskWiseOwl,
  wiseOwlAdvice,
  playSound,
  selectedMode,
  gameModeConfig
}) => {
  const [answer, setAnswer] = useState('');
  const [showAdvice, setShowAdvice] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    // Play question appear sound
    if (playSound) {
      playSound('question');
    }
  }, [question, playSound]);

  useEffect(() => {
    if (wiseOwlAdvice) {
      setShowAdvice(true);
      if (playSound) {
        playSound('owl');
      }
    }
  }, [wiseOwlAdvice, playSound]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer || parseInt(answer) <= 0) {
      // Shake animation for invalid input
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      if (playSound) {
        playSound('error');
      }
      return;
    }
    
    onAnswer(answer);
    setAnswer('');
    setShowAdvice(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      setAnswer(value);
    }
  };

  const handleWiseOwlClick = async () => {
    if (playSound) {
      playSound('owl');
    }
    if (onAskWiseOwl) {
      await onAskWiseOwl(question);
    }
  };

  const getModeIcon = (mode) => {
    switch(mode) {
      case 'addition': return '➕';
      case 'subtraction': return '➖';
      case 'multiplication': return '✖️';
      case 'division': return '➗';
      case 'exponentiation': return '⚡';
      default: return '🧮';
    }
  };

  const getModeColor = (mode) => {
    switch(mode) {
      case 'addition': return 'text-green-600';
      case 'subtraction': return 'text-red-600';
      case 'multiplication': return 'text-blue-600';
      case 'division': return 'text-purple-600';
      case 'exponentiation': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  const getGradientColors = (mode) => {
    switch(mode) {
      case 'addition': return 'from-green-500 to-green-600';
      case 'subtraction': return 'from-red-500 to-red-600';
      case 'multiplication': return 'from-blue-500 to-blue-600';
      case 'division': return 'from-purple-500 to-purple-600';
      case 'exponentiation': return 'from-yellow-500 to-yellow-600';
      default: return 'from-green-500 to-blue-500';
    }
  };

  const formatQuestion = () => {
    if (!question || !question.questionData) {
      return { display: question?.question || '', symbol: '=' };
    }

    const { questionData } = question;
    switch(questionData.operation) {
      case 'addition':
        return { display: `${questionData.num1} + ${questionData.num2}`, symbol: '=' };
      case 'subtraction':
        return { display: `${questionData.num1} - ${questionData.num2}`, symbol: '=' };
      case 'multiplication':
        return { display: `${questionData.num1} × ${questionData.num2}`, symbol: '=' };
      case 'division':
        return { display: `${questionData.num1} ÷ ${questionData.num2}`, symbol: '=' };
      case 'exponentiation':
        return { display: `${questionData.num1}^${questionData.num2}`, symbol: '=' };
      default:
        return { display: question.question, symbol: '=' };
    }
  };

  const questionFormat = formatQuestion();

  return (
    <>
      <style jsx>{`
        @keyframes modalSlideIn {
          0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes owlWing {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        
        @keyframes adviceSlide {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        .modal-enter {
          animation: modalSlideIn 0.3s ease-out;
        }
        
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .owl-button {
          position: relative;
          overflow: hidden;
        }
        
        .owl-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .owl-button:hover::before {
          left: 100%;
        }
        
        .owl-wing {
          animation: owlWing 2s ease-in-out infinite;
        }
        
        .advice-container {
          animation: adviceSlide 0.5s ease-out;
        }
        
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .question-highlight {
          background: linear-gradient(45deg, #FFF8DC, #F0E68C);
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
      
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className={`bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 modal-enter border-2 border-amber-200 ${isShaking ? 'shake' : ''}`}>
          {/* Question Header with visual enhancement */}
          <div className="question-highlight mb-6 relative">
            <div className="absolute top-2 right-2 sparkle text-yellow-500">✨</div>
            <div className="flex items-center justify-center mb-2">
              <span className="text-3xl mr-2">{getModeIcon(selectedMode)}</span>
              <h3 className="text-xl font-bold text-gray-800">
                Rozwiąż zadanie
              </h3>
            </div>
            <div className="text-center">
              <span className={`text-3xl font-bold ${getModeColor(selectedMode)}`}>
                {questionFormat.display}
              </span>
              <span className="text-2xl font-bold text-gray-600 mx-3">{questionFormat.symbol}</span>
              <span className="text-2xl font-bold text-green-600">?</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="number"
                min="0"
                value={answer}
                onChange={handleChange}
                className="w-full p-4 border-2 border-blue-300 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                placeholder="Twoja odpowiedź..."
                autoFocus
              />
              {wrongAnswersCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Błędów: {wrongAnswersCount}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!answer}
              className={`w-full bg-gradient-to-r ${getGradientColors(selectedMode)} text-white py-3 px-6 rounded-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transform active:scale-95`}
            >
              ✅ Sprawdź odpowiedź
            </button>

            {wrongAnswersCount >= 1 && onAskWiseOwl && (
              <button
                type="button"
                onClick={handleWiseOwlClick}
                disabled={isGeminiLoading}
                className="w-full owl-button bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-800 py-3 px-6 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold text-lg transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
              >
                <span className="owl-wing">🦉</span>
                <span>
                  {isGeminiLoading ? 'Mądra Sowa myśli...' : '✨ Zapytaj Mądrą Sowę'}
                </span>
                {isGeminiLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                )}
              </button>
            )}
          </form>

          {/* Wise Owl Advice */}
          {showAdvice && wiseOwlAdvice && (
            <div className="mt-6 advice-container">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-blue-500">
                  <span className="owl-wing">🦉</span>
                </div>
                <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  Rada od Mądrej Sowy:
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {wiseOwlAdvice}
                </p>
                <div className="absolute bottom-1 right-1 opacity-20">
                  <div className="flex space-x-1">
                    <span className="sparkle text-yellow-400">⭐</span>
                    <span className="sparkle text-blue-400" style={{animationDelay: '0.5s'}}>⭐</span>
                    <span className="sparkle text-purple-400" style={{animationDelay: '1s'}}>⭐</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Difficulty indicators */}
          <div className="mt-4 flex justify-center space-x-2">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  wrongAnswersCount >= level 
                    ? 'bg-red-400 shadow-lg' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          {wrongAnswersCount >= 2 && (
            <p className="text-center text-sm text-gray-600 mt-2">
              💡 Wskazówka: Spróbuj rozłożyć działanie na prostsze części
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionModal;