import React, { useState, useEffect, useRef } from 'react';
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
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const autoSaveIntervalRef = useRef(null);

  // Load saved whiteboard data on component mount
  useEffect(() => {
    if (isOpen && !isDataLoaded) {
      const savedData = localStorage.getItem('interactiveWhiteboardData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('Loading whiteboard data:', parsedData);
          setWhiteboardData(parsedData);
          setLastSaveTime(parsedData.lastSaved);
        } catch (error) {
          console.warn('Failed to load whiteboard data:', error);
        }
      }
      setIsDataLoaded(true);
    }
  }, [isOpen, isDataLoaded]);

  // Save whiteboard data
  const saveWhiteboardData = (elements, appState, showNotification = false) => {
    if (!excalidrawAPI) return;

    const dataToSave = {
      elements: elements || [],
      appState: appState || {},
      lastSaved: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('interactiveWhiteboardData', JSON.stringify(dataToSave));
      setWhiteboardData(dataToSave);
      setLastSaveTime(dataToSave.lastSaved);
      
      if (showNotification) {
        console.log('Whiteboard data saved manually');
        // Show temporary save confirmation
        const event = new CustomEvent('whiteboardSaved');
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.warn('Failed to save whiteboard data:', error);
    }
  };

  // Auto-save function
  const autoSave = () => {
    if (excalidrawAPI && isOpen) {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      
      // Only save if there are elements or if appState has meaningful changes
      if (elements.length > 0 || Object.keys(appState).length > 0) {
        saveWhiteboardData(elements, appState, false);
        console.log('Auto-saved whiteboard data');
      }
    }
  };

  // Set up auto-save interval
  useEffect(() => {
    if (isOpen && excalidrawAPI) {
      // Clear any existing interval
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      
      // Set up new auto-save interval
      autoSaveIntervalRef.current = setInterval(autoSave, 5000); // Auto-save every 5 seconds
      
      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [isOpen, excalidrawAPI]);

  // Save data when closing
  useEffect(() => {
    if (!isOpen && excalidrawAPI) {
      autoSave(); // Save before closing
    }
  }, [isOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);

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
      setLastSaveTime(null);
    }
  };

  const handleManualSave = () => {
    if (excalidrawAPI) {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      saveWhiteboardData(elements, appState, true);
    }
  };

  // Handle Excalidraw API ready
  const handleExcalidrawAPIReady = (api) => {
    setExcalidrawAPI(api);
    
    // If we have saved data and the API is ready, load it
    if (whiteboardData && whiteboardData.elements) {
      console.log('Loading saved data into Excalidraw:', whiteboardData);
      
      // Use setTimeout to ensure Excalidraw is fully initialized
      setTimeout(() => {
        try {
          api.updateScene({
            elements: whiteboardData.elements,
            appState: whiteboardData.appState || {}
          });
          console.log('Successfully loaded saved whiteboard data');
        } catch (error) {
          console.warn('Failed to load saved data into Excalidraw:', error);
        }
      }, 100);
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

    // If we have saved data, use it for initial data
    if (whiteboardData && whiteboardData.elements) {
      console.log('Using saved data for initial data:', whiteboardData);
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
              {lastSaveTime && (
                <span className="text-xs text-gray-500">
                  {t('lastSaved')}: {new Date(lastSaveTime).toLocaleString()}
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
          {isDataLoaded && (
            <Excalidraw
              ref={handleExcalidrawAPIReady}
              initialData={getInitialData()}
              viewModeEnabled={viewModeEnabled}
              zenModeEnabled={false}
              gridModeEnabled={false}
              theme="light"
              name="Edu-Future Whiteboard"
              onChange={(elements, appState, files) => {
                // Save on every change (will be debounced by auto-save interval)
                // This ensures we capture all changes
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
          )}
          
          {/* Loading indicator while data is being loaded */}
          {!isDataLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">{t('loadingWhiteboard')}</p>
              </div>
            </div>
          )}
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