import React from 'react';
import { Play, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import WaterTankVisualization from './WaterTankVisualization';
import { useLanguage } from '../contexts/LanguageContext';

const WaterTankContent = ({ currentStep, setCurrentStep }) => {
  const { t } = useLanguage();

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
                  powinien być "kwadratowy\" w przekroju pionowym.
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
                  <strong>Zadanie 1:</strong> Jeśli promień optymalnego zbiornika wynosi 3 metry, 
                  jaka powinna być jego wysokość?
                </label>
                <input
                  type="text"
                  placeholder="h = ... metrów"
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: h = 2r (wysokość = średnica)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 2:</strong> Oblicz objętość tego optymalnego zbiornika 
                  (r = 3m, h = 6m)
                </label>
                <input
                  type="text"
                  placeholder="V = π × r² × h = ..."
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: V = π × 3² × 6 = π × 9 × 6 = 54π ≈ 169,6 m³
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 3:</strong> Jaka jest optymalna proporcja h/r dla każdego zbiornika?
                </label>
                <input
                  type="text"
                  placeholder="h/r = ..."
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: Jeśli h = 2r, to h/r = 2
                </p>
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