import React, { useState, useEffect } from 'react';
import { X, ExternalLink, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { developmentConfig } from '../config/developmentMode';

const InteractiveWhiteboard = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Hide loading after 3 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const whiteboardUrl = "https://zoom.us/wb/doc/okffxvPUQfqT-rcN1RUSbQ";

  const handleOpenInNewTab = () => {
    window.open(whiteboardUrl, '_blank', 'noopener,noreferrer');
  };

  const isInDevelopmentMode = developmentConfig.underConstruction && !user;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[95vw] h-[90vh] max-w-7xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📝</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-color">
                {t('interactiveWhiteboard')}
              </h2>
              {isInDevelopmentMode && (
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                  🚧 Development Mode
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInNewTab}
              className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-gray-100"
              title={t('openInNewTab')}
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-md hover:bg-gray-100"
              title={t('close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Development Mode Warning */}
        {isInDevelopmentMode && (
          <div className="bg-yellow-50 border-b border-yellow-200 p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                This feature is in development mode. Sign in for full functionality.
              </span>
            </div>
          </div>
        )}

        {/* Iframe Content */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-b-xl z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('loadingWhiteboard')}</p>
              </div>
            </div>
          )}
          
          <iframe
            src={whiteboardUrl}
            className="w-full h-full border-0 rounded-b-xl"
            title={t('interactiveWhiteboard')}
            allow="camera; microphone; fullscreen; display-capture"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Footer with instructions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>💡 {t('whiteboardTip')}</span>
            </div>
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {t('openInNewTab')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;