import React, { useState } from 'react';

const QuestionModal = ({ question, onAnswer, wrongAnswersCount, isGeminiLoading }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer || parseInt(answer) <= 0) return;
    onAnswer(answer);
    setAnswer('');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setAnswer(value);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-text-color mb-6">
          Ile to jest {question.originalMultiplier1} × {question.originalMultiplier2}?
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            min="1"
            value={answer}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            autoFocus
          />
          
          <button
            type="submit"
            disabled={!answer || parseInt(answer) <= 0}
            className="w-full bg-accent-primary text-white py-3 px-6 rounded-md hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Odpowiedz
          </button>

          {wrongAnswersCount >= 1 && (
            <button
              type="button"
              disabled={isGeminiLoading}
              className="w-full bg-[#FFC107] text-gray-800 py-2 px-4 rounded-md hover:bg-[#ffb300] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ✨ Zapytaj Mądrą Sowę
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;