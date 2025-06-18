import React, { useState, useEffect } from 'react';
import { MessageCircle, PenTool, BookOpen, ChevronDown, ChevronUp, Maximize2, Minimize2, X } from 'lucide-react';
import ChatPanel from '../ChatPanel';
import InteractiveWhiteboard from '../InteractiveWhiteboard';
import PowersRoots from '../Formulas/PowersRoots';
import { useLanguage } from '../../contexts/LanguageContext';

const RightPanel = () => {
  const { t, currentLanguage } = useLanguage();
  const [activeWidget, setActiveWidget] = useState('chat'); // 'chat', 'whiteboard', 'formulas', null
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [whiteboardState, setWhiteboardState] = useState({ isOpen: false });
  const [hasWhiteboardData, setHasWhiteboardData] = useState(false);

  // Check if whiteboard has saved data
  useEffect(() => {
    const checkWhiteboardData = () => {
      const savedData = localStorage.getItem('interactiveWhiteboardData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setHasWhiteboardData(parsedData.elements && parsedData.elements.length > 0);
        } catch (error) {
          setHasWhiteboardData(false);
        }
      } else {
        setHasWhiteboardData(false);
      }
    };

    checkWhiteboardData();
    
    // Listen for whiteboard save events
    const handleWhiteboardSaved = () => {
      checkWhiteboardData();
    };

    window.addEventListener('whiteboardSaved', handleWhiteboardSaved);
    
    // Check periodically for changes
    const interval = setInterval(checkWhiteboardData, 2000);

    return () => {
      window.removeEventListener('whiteboardSaved', handleWhiteboardSaved);
      clearInterval(interval);
    };
  }, []);

  const widgets = [
    {
      id: 'chat',
      name: t('aiMentor'),
      icon: MessageCircle,
      component: ChatPanel,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'whiteboard',
      name: t('interactiveWhiteboard'),
      icon: PenTool,
      component: InteractiveWhiteboard,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'formulas',
      name: t('powersRootsTitle'),
      icon: BookOpen,
      component: PowersRoots,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const activeWidgetData = widgets.find(w => w.id === activeWidget);

  const handleWidgetClick = (widgetId) => {
    if (activeWidget === widgetId) {
      setIsExpanded(!isExpanded);
    } else {
      setActiveWidget(widgetId);
      setIsExpanded(true);
    }
    setIsFullscreen(false);
    
    // Special handling for whiteboard
    if (widgetId === 'whiteboard') {
      setWhiteboardState({ isOpen: true });
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
    
    // Special handling for whiteboard in fullscreen
    if (activeWidget === 'whiteboard') {
      setWhiteboardState({ isOpen: true });
    }
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleMinimize = () => {
    setIsExpanded(false);
    
    // Keep whiteboard state when minimizing
    if (activeWidget === 'whiteboard') {
      setWhiteboardState({ isOpen: false });
    }
  };

  const handleClose = () => {
    setActiveWidget(null);
    setIsExpanded(false);
    setIsFullscreen(false);
    
    // Close whiteboard but keep its data
    if (activeWidget === 'whiteboard') {
      setWhiteboardState({ isOpen: false });
    }
  };

  const handleWhiteboardClose = () => {
    // When whiteboard is closed from within the component
    setWhiteboardState({ isOpen: false });
    setIsFullscreen(false);
    
    // If we're in panel mode, just minimize
    if (!isFullscreen) {
      setIsExpanded(false);
    }
  };

  const handleOpenWhiteboardFullscreen = () => {
    setWhiteboardState({ isOpen: true });
    setIsFullscreen(true);
  };

  const renderWidgetContent = () => {
    if (!activeWidget || !activeWidgetData) return null;

    const WidgetComponent = activeWidgetData.component;

    // Special handling for different components
    switch (activeWidget) {
      case 'chat':
        return <WidgetComponent />;
      case 'whiteboard':
        return (
          <WidgetComponent 
            isOpen={whiteboardState.isOpen} 
            onClose={handleWhiteboardClose}
          />
        );
      case 'formulas':
        return (
          <div className="p-4 h-full overflow-y-auto">
            <WidgetComponent />
          </div>
        );
      default:
        return <WidgetComponent />;
    }
  };

  // Fullscreen modal
  if (isFullscreen && activeWidget) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Fullscreen header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <activeWidgetData.icon className={`w-5 h-5 ${activeWidgetData.color}`} />
            <h2 className="text-lg font-semibold text-gray-800">
              {activeWidgetData.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
              title="Exit fullscreen"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
              title={t('close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Fullscreen content */}
        <div className="flex-1 overflow-hidden">
          {renderWidgetContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col shadow-lg mt-16">
      {/* Widget tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {widgets.map((widget) => (
          <button
            key={widget.id}
            onClick={() => handleWidgetClick(widget.id)}
            className={`flex-1 p-3 flex items-center justify-center gap-2 transition-colors border-b-2 relative ${
              activeWidget === widget.id
                ? `${widget.borderColor} ${widget.bgColor} ${widget.color}`
                : 'border-transparent hover:bg-gray-100 text-gray-600'
            }`}
            title={widget.name}
          >
            <widget.icon className="w-4 h-4" />
            <span className="text-xs font-medium hidden lg:inline">
              {widget.name.length > 8 ? widget.name.substring(0, 8) + '...' : widget.name}
            </span>
            {/* Show indicator for whiteboard with saved data */}
            {widget.id === 'whiteboard' && hasWhiteboardData && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Widget header */}
      {activeWidget && activeWidgetData && (
        <div className={`p-3 border-b border-gray-200 ${activeWidgetData.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <activeWidgetData.icon className={`w-4 h-4 ${activeWidgetData.color}`} />
              <h3 className="font-medium text-gray-800 text-sm">
                {activeWidgetData.name}
              </h3>
              {/* Show saved indicator for whiteboard */}
              {activeWidget === 'whiteboard' && hasWhiteboardData && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  💾 {t('saved')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={handleFullscreen}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title={t('close')}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Widget content */}
      {activeWidget && isExpanded && (
        <div className="flex-1 overflow-hidden">
          {/* Special handling for whiteboard in panel mode */}
          {activeWidget === 'whiteboard' ? (
            <div className="h-full flex flex-col">
              <div className="p-4 text-center border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  {t('whiteboardPanelMode')}
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setWhiteboardState({ isOpen: true })}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 mx-auto"
                  >
                    <PenTool className="w-4 h-4" />
                    {t('openWhiteboard')}
                  </button>
                  <button
                    onClick={handleOpenWhiteboardFullscreen}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 mx-auto"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Fullscreen
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('workAutoSaved')}
                </p>
                {hasWhiteboardData && (
                  <p className="text-xs text-green-600 mt-1">
                    ✅ {t('saved')} - {t('lastSaved')}
                  </p>
                )}
              </div>
              
              {/* Show whiteboard preview or status */}
              <div className="flex-1 p-4 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm">
                    {hasWhiteboardData 
                      ? `${t('saved')} - ${t('clickToStartDrawing')}`
                      : t('clickToStartDrawing')
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            renderWidgetContent()
          )}
        </div>
      )}

      {/* Empty state */}
      {!activeWidget && (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {t('selectToolFromTabs')}
            </p>
          </div>
        </div>
      )}

      {/* Render whiteboard modal when needed */}
      {activeWidget === 'whiteboard' && renderWidgetContent()}
    </div>
  );
};

export default RightPanel;