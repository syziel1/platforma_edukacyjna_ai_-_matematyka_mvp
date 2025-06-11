import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import ConstellationMap from './ConstellationMap';

const KnowledgeMapModal = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div 
        className={`bg-gray-900 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full rounded-none' 
            : 'w-[95vw] h-[90vh] max-w-7xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🌌</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Konstelacja Kompetencji
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-800"
              title={isFullscreen ? 'Wyjdź z pełnego ekranu' : 'Pełny ekran'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-800"
              title="Zamknij mapę"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Content */}
        <div className="flex-1 relative overflow-hidden">
          <ConstellationMap />
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
              <span className="text-gray-300">Centrum</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
              <span className="text-gray-300">Planeta (główny temat)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-300">Księżyc (podtemat)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
              <span className="text-gray-300">Dostępne</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full opacity-50"></div>
              <span className="text-gray-300">Zablokowane</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
              <span className="text-gray-300">Ukończone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeMapModal;