import React from 'react';
import { Play, ArrowRight, ArrowLeft, CheckCircle, TrendingUp } from 'lucide-react';
import EcoTshirtSimulator from './EcoTshirtSimulator';
import { useLanguage } from '../contexts/LanguageContext';

const EcoTshirtContent = ({ currentStep, setCurrentStep }) => {
  const { t } = useLanguage();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-nav-bg" />
              {t('ecoTshirtIntro')}
            </h3>
            <div className="bg-text-color/90 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-2 opacity-70" />
                <p className="text-sm opacity-70">Video placeholder</p>
              </div>
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
              {t('ecoTshirtProblem')}
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
                  <strong>Zadanie 1:</strong> Oblicz maksymalną liczbę koszulek, którą możesz wyprodukować 
                  za 1000 zł (uwzględnij rabat 15% przy zamówieniu powyżej 30 sztuk)
                </label>
                <input
                  type="text"
                  placeholder="Maksymalna liczba koszulek = ..."
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color"
                />
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: Sprawdź czy opłaca się zamówić więcej niż 30 sztuk
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 2:</strong> Przy marży 35%, jaka powinna być cena netto i brutto koszulki?
                  (koszt produkcji z rabatem)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Cena netto = ... zł"
                    className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color"
                  />
                  <input
                    type="text"
                    placeholder="Cena brutto = ... zł"
                    className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color"
                  />
                </div>
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: Marża 35% oznacza, że koszt = 65% ceny sprzedaży
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  <strong>Zadanie 3:</strong> Po sprzedaniu 3/5 wyprodukowanych koszulek, 
                  jaki jest Twój zysk/strata?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Przychód = ... zł"
                    className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color"
                  />
                  <input
                    type="text"
                    placeholder="Zysk/Strata = ... zł"
                    className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-nav-bg/50 text-text-color"
                  />
                </div>
                <p className="text-xs text-text-color/60 mt-1">
                  Wskazówka: Zysk = Przychód - Koszty całkowite produkcji
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

export default EcoTshirtContent;