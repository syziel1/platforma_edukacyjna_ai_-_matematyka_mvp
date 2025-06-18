import React, { useState, useEffect } from 'react';
import { X, ExternalLink, AlertCircle, Maximize2, Minimize2, Video } from 'lucide-react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const InteractiveWhiteboard = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [whiteboardData, setWhiteboardData] = useState(null);

  // Load saved whiteboard data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('interactiveWhiteboardData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setWhiteboardData(parsedData);
      } catch (error) {
        console.warn('Failed to load whiteboard data:', error);
      }
    }
  }, []);

  // Save whiteboard data when it changes
  const saveWhiteboardData = (elements, appState) => {
    const dataToSave = {
      elements: elements || [],
      appState: appState || {},
      lastSaved: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('interactiveWhiteboardData', JSON.stringify(dataToSave));
      setWhiteboardData(dataToSave);
    } catch (error) {
      console.warn('Failed to save whiteboard data:', error);
    }
  };

  // Auto-save function that will be called periodically
  const autoSave = () => {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      saveWhiteboardData(elements, appState);
    }
  };

  // Set up auto-save interval
  useEffect(() => {
    if (isOpen && excalidrawAPI) {
      const autoSaveInterval = setInterval(autoSave, 5000); // Auto-save every 5 seconds
      return () => clearInterval(autoSaveInterval);
    }
  }, [isOpen, excalidrawAPI]);

  // Save data when closing
  useEffect(() => {
    if (!isOpen && excalidrawAPI) {
      autoSave(); // Save before closing
    }
  }, [isOpen, excalidrawAPI]);

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
    if (excalidrawAPI && confirm(t('clearWhiteboard'))) {
      excalidrawAPI.resetScene();
      // Clear saved data as well
      localStorage.removeItem('interactiveWhiteboardData');
      setWhiteboardData(null);
    }
  };

  const handleManualSave = () => {
    autoSave();
    // Show confirmation
    const saveButton = document.querySelector('[title="' + t('saveManually') + '"]');
    if (saveButton) {
      const originalText = saveButton.textContent;
      saveButton.textContent = '✅';
      setTimeout(() => {
        saveButton.textContent = originalText;
      }, 1000);
    }
  };

  // Prepare initial data for Excalidraw
  const getInitialData = () => {
    const defaultData = {
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
    };

    // If we have saved data, merge it with defaults
    if (whiteboardData) {
      return {
        elements: whiteboardData.elements || [],
        appState: {
          ...defaultData.appState,
          ...(whiteboardData.appState || {})
        },
        scrollToContent: false // Don't auto-scroll if we're loading saved content
      };
    }

    return defaultData;
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
              {whiteboardData?.lastSaved && (
                <span className="text-xs text-gray-500">
                  {t('lastSaved')}: {new Date(whiteboardData.lastSaved).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Manual Save Button */}
            <button
              onClick={handleManualSave}
              className="text-gray-600 hover:text-green-600 transition-colors p-2 rounded-md hover:bg-gray-100"
              title={t('saveManually')}
            >
              💾
            </button>
            
            {/* Zoom Whiteboard Option */}
            <button
              onClick={handleOpenZoomWhiteboard}
              className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-gray-100 flex items-center gap-1"
              title={t('openZoomWhiteboard')}
            >
              <Video className="w-4 h-4" />
              <span className="text-xs hidden md:inline">Zoom</span>
            </button>
            
            {/* Export Image */}
            <button
              onClick={handleExportImage}
              className="text-gray-600 hover:text-green-600 transition-colors p-2 rounded-md hover:bg-gray-100"
              title="Export as image"
            >
              📷
            </button>
            
            {/* Clear Canvas */}
            <button
              onClick={handleClearCanvas}
              className="text-gray-600 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-gray-100"
              title="Clear whiteboard"
            >
              🗑️
            </button>
            
            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
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

        {/* Excalidraw Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <Excalidraw
            ref={(api) => setExcalidrawAPI(api)}
            initialData={getInitialData()}
            viewModeEnabled={viewModeEnabled}
            zenModeEnabled={false}
            gridModeEnabled={false}
            theme="light"
            name="Edu-Future Whiteboard"
            onChange={(elements, appState) => {
              // Auto-save on every change (debounced by the interval above)
              // This ensures we don't lose work even if the user doesn't wait for auto-save
            }}
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
                🎥 {t('openZoomWhiteboard')}
              </MainMenu.Item>
              <MainMenu.Item onSelect={handleManualSave}>
                💾 {t('saveNow')}
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
                  {t('interactiveWhiteboard')} Edu-Future!
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
              <span className="text-xs">• Draw • Write • Add shapes • Collaborate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                ✅ {t('autoSave5s')}
              </div>
              <button
                onClick={() => setViewModeEnabled(!viewModeEnabled)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  viewModeEnabled 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {viewModeEnabled ? `👁️ ${t('viewMode')}` : `✏️ ${t('editMode')}`}
              </button>
              <button
                onClick={handleOpenZoomWhiteboard}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-xs"
              >
                <Video className="w-3 h-3" />
                Zoom Whiteboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWhiteboard;