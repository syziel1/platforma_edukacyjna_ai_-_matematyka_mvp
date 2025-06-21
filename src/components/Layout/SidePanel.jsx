import React, { useState } from 'react';
import { MessageCircle, PenTool, BookOpen, ChevronDown } from 'lucide-react';
import ChatPanel from '../ChatPanel';
import InteractiveWhiteboard from '../InteractiveWhiteboard';
import PowersRoots from '../Formulas/PowersRoots';
import { useLanguage } from '../../contexts/LanguageContext';

const SidePanel = ({ isMobile = false }) => {
  const { t } = useLanguage();
  // Stan do śledzenia, który widżet jest aktualnie rozwinięty. Domyślnie czat.
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
      component: null, // Będzie obsługiwany przez przycisk
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

  // Funkcja do przełączania widoczności widżetów
  const handleToggleWidget = (widgetId) => {
    // Jeśli klikniemy na już otwarty widżet, zamknie się on.
    // W przeciwnym razie, otworzy się nowo kliknięty.
    setExpandedWidget(prev => (prev === widgetId ? null : widgetId));
  };

  const renderWidgetContent = (widget) => {
    // Specjalna obsługa dla tablicy - pokazuje przycisk do otwarcia modala
    if (widget.id === 'whiteboard') {
      return (
        <div className="p-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            {t('whiteboardPanelMode')}
          </p>
          <button
            onClick={() => setWhiteboardModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <PenTool className="w-4 h-4" />
            {t('openWhiteboard')}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            {t('workAutoSaved')}
          </p>
        </div>
      );
    }

    // Renderowanie pozostałych komponentów
    const WidgetComponent = widget.component;
    if (!WidgetComponent) return null;

    if (widget.id === 'chat') {
      return <WidgetComponent isMobile={isMobile} />;
    }
    
    return (
      <div className="p-4 h-full overflow-y-auto border-t border-gray-200">
        <WidgetComponent />
      </div>
    );
  };

  return (
    <>
      <div className="h-full bg-white flex flex-col shadow-lg overflow-y-auto">
        {widgets.map((widget) => {
          const isExpanded = expandedWidget === widget.id;
          return (
            <div key={widget.id} className="border-b border-gray-200">
              {/* Nagłówek widżetu - zawsze widoczny i klikalny */}
              <button
                onClick={() => handleToggleWidget(widget.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <widget.icon className={`w-5 h-5 ${widget.color}`} />
                  <h3 className="font-semibold text-text-color">
                    {widget.name}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Treść widżetu - renderowana warunkowo */}
              {isExpanded && (
                <div className="flex-1 flex flex-col overflow-hidden">
                   {renderWidgetContent(widget)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal tablicy interaktywnej - jego logika pozostaje bez zmian */}
      <InteractiveWhiteboard 
        isOpen={isWhiteboardModalOpen}
        onClose={() => setWhiteboardModalOpen(false)}
      />
    </>
  );
};

export default SidePanel;