import React, { useState } from 'react';
import { MessageCircle, PenTool, BookOpen, ChevronDown } from 'lucide-react';
import ChatPanel from '../ChatPanel';
import InteractiveWhiteboard from '../InteractiveWhiteboard';
import PowersRoots from '../Formulas/PowersRoots';
import { useLanguage } from '../../contexts/LanguageContext';

const SidePanel = ({ isMobile = false }) => {
  const { t } = useLanguage();
  const [expandedWidget, setExpandedWidget] = useState('chat'); 
  const [isWhiteboardModalOpen, setWhiteboardModalOpen] = useState(false);

  const widgets = [
    {
      id: 'chat',
      name: t('aiMentor'),
      icon: MessageCircle,
      component: ChatPanel,
      color: 'text-blue-600',
    },
    {
      id: 'whiteboard',
      name: t('interactiveWhiteboard'),
      icon: PenTool,
      component: null,
      color: 'text-green-600',
    },
    {
      id: 'formulas',
      name: t('powersRootsTitle'),
      icon: BookOpen,
      component: PowersRoots,
      color: 'text-purple-600',
    }
  ];

  const handleToggleWidget = (widgetId) => {
    setExpandedWidget(prev => (prev === widgetId ? null : widgetId));
  };

  const renderWidgetContent = (widget) => {
    if (widget.id === 'whiteboard') {
      return (
        <div className="p-4 text-center border-t border-bg-neutral">
          <p className="text-sm text-text-color/70 mb-3">
            {t('whiteboardPanelMode')}
          </p>
          <button
            onClick={() => setWhiteboardModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <PenTool className="w-4 h-4" />
            {t('openWhiteboard')}
          </button>
          <p className="text-xs text-text-color/60 mt-2">
            {t('workAutoSaved')}
          </p>
        </div>
      );
    }

    const WidgetComponent = widget.component;
    if (!WidgetComponent) return null;

    if (widget.id === 'chat') {
      // ChatPanel ma własne tło, więc nie potrzebuje dodatkowego opakowania
      return <WidgetComponent isMobile={isMobile} />;
    }
    
    return (
      <div className="h-full overflow-y-auto border-t border-bg-neutral">
        <WidgetComponent />
      </div>
    );
  };

  return (
    <>
      {/* GŁÓWNA ZMIANA: Zastosowanie tła 'bg-bg-card' */}
      <div className="h-full bg-bg-card flex flex-col shadow-lg overflow-y-auto">
        {widgets.map((widget) => {
          const isExpanded = expandedWidget === widget.id;
          return (
            // GŁÓWNA ZMIANA: Zastosowanie ramki 'border-bg-neutral'
            <div key={widget.id} className="border-b border-bg-neutral">
              <button
                onClick={() => handleToggleWidget(widget.id)}
                // GŁÓWNA ZMIANA: Użycie 'bg-bg-main' dla spójnego efektu hover
                className="w-full p-4 flex items-center justify-between text-left hover:bg-bg-main transition-colors"
              >
                <div className="flex items-center gap-3">
                  <widget.icon className={`w-5 h-5 ${widget.color}`} />
                  <h3 className="font-semibold text-text-color">
                    {widget.name}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-text-color/50 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isExpanded && (
                <div className="flex-1 flex flex-col overflow-hidden">
                   {renderWidgetContent(widget)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <InteractiveWhiteboard 
        isOpen={isWhiteboardModalOpen}
        onClose={() => setWhiteboardModalOpen(false)}
      />
    </>
  );
};

export default SidePanel;