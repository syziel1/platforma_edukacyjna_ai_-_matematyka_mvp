import React from 'react';
import { Map, ArrowRight } from 'lucide-react';

const KnowledgeMapCard = ({ onOpenKnowledgeMap }) => {
  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h3 className="text-lg font-bold text-text-color mb-4 flex items-center gap-2">
        <Map className="w-5 h-5 text-nav-bg" />
        Eksploruj Mapę Wiedzy
      </h3>
      
      {/* Mini-mapa */}
      <div className="mb-4 relative rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 h-32 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-nav-bg/30 to-accent-primary/30" />
        </div>
        <div className="relative z-10 text-center">
          <div className="text-3xl mb-2">🗺️</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Opis */}
      <p className="text-text-color/70 text-sm mb-4 leading-relaxed">
        Odkrywaj nowe tematy i wizualizuj swoje postępy w nauce matematyki.
      </p>

      {/* Przycisk */}
      <button
        onClick={onOpenKnowledgeMap}
        className="w-full bg-nav-bg text-white py-3 px-4 rounded-lg hover:bg-nav-bg/90 transition-colors font-medium flex items-center justify-center gap-2"
      >
        PRZEJDŹ DO MAPY
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default KnowledgeMapCard;