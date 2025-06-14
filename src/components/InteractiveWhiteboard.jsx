import React, { useState, useEffect } from 'react';
import { X, ExternalLink, AlertCircle, Maximize2, Minimize2, Video } from 'lucide-react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { developmentConfig } from '../config/developmentMode';

const InteractiveWhiteboard = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [viewModeEnabled, setViewModeEnabled] = useState(false);

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

  const whiteboardUrl = "https://zoom.us/wb/doc/okffxvPUQfqT-rcN1RUSbQ";
  const isInDevelopmentMode = developmentConfig.underConstruction && !user;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleOpenZoomWhiteboard = () => {
    window.open(whiteboardUrl, '_blank', 'noopener,noreferrer');
  };

  const handleExportImage = () => {
    if (excalidrawAPI) {
      excalidrawAPI.exportToBlob({
        mimeType: "image/png",
        quality: 0.8,
      }).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'whiteboard-export.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const handleClearCanvas = () => {
    if (excalidrawAPI && confirm('Czy na pewno chcesz wyczyścić tablicę?')) {
      excalidrawAPI.resetScene();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div 
        className={`bg-white rounded-xl shadow-2xl transition-all duration-300 flex flex-col ${
          isFullscreen 
            ? 'w-full h-full rounded-none' 
            : 'w-[95vw] h-[90vh] max-w-7xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl flex-shrink-0">
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
            {/* Zoom Whiteboard Option */}
            <button
              onClick={handleOpenZoomWhiteboard}
              className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-gray-100 flex items-center gap-1"
              title="Otwórz tablicę Zoom"
            >
              <Video className="w-4 h-4" />
              <span className="text-xs hidden md:inline">Zoom</span>
            </button>
            
            {/* Export Image */}
            <button
              onClick={handleExportImage}
              className="text-gray-600 hover:text-green-600 transition-colors p-2 rounded-md hover:bg-gray-100"
              title="Eksportuj jako obraz"
            >
              📷
            </button>
            
            {/* Clear Canvas */}
            <button
              onClick={handleClearCanvas}
              className="text-gray-600 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-gray-100"
              title="Wyczyść tablicę"
            >
              🗑️
            </button>
            
            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100"
              title={isFullscreen ? 'Wyjdź z pełnego ekranu' : 'Pełny ekran'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
            
            {/* Close */}
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
          <div className="bg-yellow-50 border-b border-yellow-200 p-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Ta funkcja jest w trybie rozwojowym. Zaloguj się dla pełnej funkcjonalności.
              </span>
            </div>
          </div>
        )}

        {/* Excalidraw Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <Excalidraw
            ref={(api) => setExcalidrawAPI(api)}
            initialData={{
              elements: [],
              appState: {
                viewBackgroundColor: "#ffffff",
                currentItemFontFamily: 1,
                currentItemFontSize: 20,
                currentItemStrokeColor: "#1e1e1e",
                currentItemBackgroundColor: "transparent",
                currentItemFillStyle: "hachure",
                currentItemStrokeWidth: 1,
                currentItemStrokeStyle: "solid",
                currentItemRoughness: 1,
                currentItemOpacity: 100,
                currentItemLinearStrokeSharpness: "round",
                gridSize: null,
                colorPalette: {}
              },
              scrollToContent: true
            }}
            viewModeEnabled={viewModeEnabled}
            zenModeEnabled={false}
            gridModeEnabled={false}
            theme="light"
            name="Edu-Future Whiteboard"
            UIOptions={{
              canvasActions: {
                loadScene: false,
                export: false,
                saveToActiveFile: false,
                toggleTheme: true,
                clearCanvas: false
              }
            }}
          >
            <MainMenu>
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.DefaultItems.Export />
              <MainMenu.DefaultItems.SaveAsImage />
              <MainMenu.DefaultItems.Help />
              <MainMenu.Separator />
              <MainMenu.Item onSelect={handleOpenZoomWhiteboard}>
                🎥 Otwórz tablicę Zoom
              </MainMenu.Item>
            </MainMenu>
            <WelcomeScreen>
              <WelcomeScreen.Hints.MenuHint />
              <WelcomeScreen.Hints.ToolbarHint />
              <WelcomeScreen.Center>
                <WelcomeScreen.Center.Logo>
                  <div className="text-4xl">📝</div>
                </WelcomeScreen.Center.Logo>
                <WelcomeScreen.Center.Heading>
                  Witaj w tablicy interaktywnej Edu-Future!
                </WelcomeScreen.Center.Heading>
                <WelcomeScreen.Center.Menu>
                  <WelcomeScreen.Center.MenuItemLoadScene />
                  <WelcomeScreen.Center.MenuItemHelp />
                </WelcomeScreen.Center.Menu>
              </WelcomeScreen.Center>
            </WelcomeScreen>
          </Excalidraw>
        </div>

        {/* Footer with instructions */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex-shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>💡 {t('whiteboardTip')}</span>
              <span className="text-xs">• Rysuj • Pisz • Dodawaj kształty • Współpracuj</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewModeEnabled(!viewModeEnabled)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  viewModeEnabled 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {viewModeEnabled ? '👁️ Tryb podglądu' : '✏️ Tryb edycji'}
              </button>
              <button
                onClick={handleOpenZoomWhiteboard}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs"
              >
                <Video className="w-3 h-3" />
                Tablica Zoom
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;