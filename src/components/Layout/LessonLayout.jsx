import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlobalHeader from '../GlobalHeader';
import LessonHeader from '../LessonHeader';
import SidePanel from './SidePanel';
import { useLanguage } from '../../contexts/LanguageContext';

const LessonLayout = ({ 
  children, 
  title, 
  onBack, 
  currentStep, 
  totalSteps, 
  onStepChange 
}) => {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidePanel, setShowMobileSidePanel] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load saved panel sizes
  const [panelSizes, setPanelSizes] = useState(() => {
    const saved = localStorage.getItem('lessonPanelSizes');
    return saved ? JSON.parse(saved) : { content: 66.67, side: 33.33 };
  });

  // Save panel sizes when they change
  const handlePanelResize = (sizes) => {
    const newSizes = { content: sizes[0], side: sizes[1] };
    setPanelSizes(newSizes);
    localStorage.setItem('lessonPanelSizes', JSON.stringify(newSizes));
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-bg-main">
        <GlobalHeader 
          title={title}
          onBack={onBack}
          showBackButton={true}
        />
        
        <div className="flex-1 flex flex-col mt-20 overflow-hidden">
          {/* Lesson Header */}
          <div className="flex-shrink-0">
            <LessonHeader 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
              onBack={onBack}
              title={title}
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
          
          {/* Mobile Side Panel Toggle */}
          <div className="flex-shrink-0 border-t border-bg-neutral bg-bg-card">
            <button
              onClick={() => setShowMobileSidePanel(!showMobileSidePanel)}
              className="w-full p-3 flex items-center justify-center gap-2 text-text-color hover:bg-bg-neutral transition-colors"
            >
              {showMobileSidePanel ? (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  {t('hideTools')}
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  {t('showTools')}
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Side Panel Overlay */}
        {showMobileSidePanel && (
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileSidePanel(false)}>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl max-h-[70vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-text-color">{t('learningTools')}</h3>
                <button
                  onClick={() => setShowMobileSidePanel(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(70vh-80px)]">
                <SidePanel isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop layout with resizable panels
  return (
    <div className="flex flex-col h-screen bg-bg-main">
      <GlobalHeader 
        title={title}
        onBack={onBack}
        showBackButton={true}
      />
      
      <div className="flex-1 mt-16 overflow-hidden">
        <PanelGroup 
          direction="horizontal"
          onLayout={handlePanelResize}
        >
          {/* Content Panel */}
          <Panel 
            defaultSize={panelSizes.content}
            minSize={30}
            maxSize={85}
            className="flex flex-col"
          >
            <div className="flex flex-col h-full">
              {/* Lesson Header */}
              <div className="flex-shrink-0">
                <LessonHeader 
                  currentStep={currentStep} 
                  totalSteps={totalSteps} 
                  onBack={onBack}
                  title={title}
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </Panel>
          
          {/* Resize Handle */}
          <PanelResizeHandle className="w-2 bg-bg-neutral hover:bg-accent-primary/30 transition-colors cursor-col-resize flex items-center justify-center group">
            <div className="w-1 h-8 bg-gray-400 rounded-full group-hover:bg-accent-primary transition-colors" />
          </PanelResizeHandle>
          
          {/* Side Panel */}
          <Panel 
            defaultSize={panelSizes.side}
            minSize={15}
            maxSize={70}
            className="bg-bg-card border-l border-bg-neutral"
          >
            <SidePanel />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default LessonLayout;