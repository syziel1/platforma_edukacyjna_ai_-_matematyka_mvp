import React from 'react';
import { Play, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import InteractiveVisualization from './InteractiveVisualization';
import { useLanguage } from '../contexts/LanguageContext';

const LessonContent = ({ currentStep, setCurrentStep }) => {
  const { translate } = useLanguage();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {translate('step1Title')}
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
              Dalej <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {translate('step2Title')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <p className="leading-relaxed">
                {translate('problemText')}
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
                {translate('understood')} <ArrowRight className="w-4 h-4" />
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
                {translate('endExploration')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {translate('step4Title')}
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
                {translate('goToFormal')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {translate('step5Title')}
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  Krok 1: Oblicz współrzędną x wierzchołka (długość jednego boku)
                </label>
                <input
                  type="text"
                  placeholder="x = -b / (2a) = ..."
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  Krok 2: Oblicz długość drugiego boku
                </label>
                <input
                  type="text"
                  placeholder="y = L - x = ..."
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  Krok 3: Podaj optymalne wymiary kurnika (x × y)
                </label>
                <input
                  type="text"
                  placeholder="__ × __ metrów (np. 10,0 × 10,0)"
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-nav-bg/20 text-text-color px-6 py-2 rounded-md hover:bg-nav-bg/40 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Wstecz
              </button>
              <button
                className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {translate('checkAnswer')}
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