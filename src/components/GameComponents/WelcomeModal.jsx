import React from 'react';

const WelcomeModal = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-text-color mb-4">
          Witaj w Dżungli Mnożenia!
        </h2>
        
        <p className="text-text-color/70 mb-4">
          Przygotuj się na przygodę, podczas której nauczysz się tabliczki mnożenia, odkrywając tajemniczą dżunglę!
        </p>

        <div className="mb-6">
          <h4 className="font-semibold text-text-color mb-2">Instrukcja:</h4>
          <ul className="space-y-2 text-text-color/70">
            <li>
              Poruszaj się po planszy za pomocą klawiszy strzałek:
              <ul className="ml-4 mt-1 space-y-1">
                <li><strong>Strzałka w górę:</strong> Idź do przodu</li>
                <li><strong>Strzałka w lewo:</strong> Obróć się w lewo</li>
                <li><strong>Strzałka w prawo:</strong> Obróć się w prawo</li>
              </ul>
            </li>
            <li>Aby wejść na nowe, zarośnięte pole, musisz poprawnie rozwiązać działanie mnożenia.</li>
            <li>Poprawna odpowiedź zmniejsza trawę, błędna ją zwiększa.</li>
            <li>Pola z piaskiem są już odkryte - możesz na nie wchodzić swobodnie.</li>
            <li>Odkrywaj kolejne poziomy, usuwając trawę i zdobywając punkty!</li>
            <li>Szukaj ukrytych bonusów i ciekawostek od Ducha Dżungli!</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-accent-primary text-white py-3 px-6 rounded-md hover:bg-accent-primary/90 transition-colors text-lg font-medium"
        >
          Rozpocznij Grę!
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;