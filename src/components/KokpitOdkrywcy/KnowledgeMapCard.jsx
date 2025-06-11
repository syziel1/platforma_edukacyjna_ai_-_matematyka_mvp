import React from 'react';
import { Map, ArrowRight } from 'lucide-react';

const KnowledgeMapCard = ({ onOpenKnowledgeMap }) => {
  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <h3 className="text-lg font-bold text-text-color mb-4 flex items-center gap-2">
        <Map className="w-5 h-5 text-nav-bg" />
        Constellation of Competencies
      </h3>
      
      {/* Mini-mapa z kosmicznym motywem */}
      <div className="mb-4 relative rounded-lg overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black h-32 flex items-center justify-center">
        {/* Tło gwiazd */}
        <div className="absolute inset-0">
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-80" style={{ top: '20%', left: '15%' }}></div>
          <div className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60" style={{ top: '30%', left: '80%' }}></div>
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-70" style={{ top: '70%', left: '25%' }}></div>
          <div className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-50" style={{ top: '80%', left: '70%' }}></div>
          <div className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-40" style={{ top: '10%', left: '60%' }}></div>
        </div>
        
        {/* Centralne słońce */}
        <div className="relative z-10 text-center">
          <div className="text-2xl mb-2 animate-pulse">☀️</div>
          
          {/* Planety na orbitach */}
          <div className="absolute -top-6 -left-8">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
          </div>
          <div className="absolute -top-2 left-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          </div>
          <div className="absolute top-6 -right-6">
            <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></div>
          </div>
          <div className="absolute top-2 -left-10">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
          </div>
          
          {/* Orbity (subtelne) */}
          <div className="absolute inset-0 border border-white/10 rounded-full w-16 h-16 -top-8 -left-8"></div>
          <div className="absolute inset-0 border border-white/5 rounded-full w-20 h-20 -top-10 -left-10"></div>
        </div>
      </div>

      {/* Opis */}
      <p className="text-text-color/70 text-sm mb-4 leading-relaxed">
        Explore the galaxy of mathematical knowledge. Discover new topics and track your progress in the cosmic constellation of skills.
      </p>

      {/* Przycisk */}
      <button
        onClick={onOpenKnowledgeMap}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg"
      >
        EXPLORE CONSTELLATION
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default KnowledgeMapCard;