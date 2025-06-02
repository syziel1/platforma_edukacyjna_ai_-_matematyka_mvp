import React, { useState } from 'react';
import { Menu, CheckSquare, Calendar, Settings, LogOut, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NavigationPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { translate, switchLanguage, currentLanguage } = useLanguage();

  const menuItems = [
    { icon: CheckSquare, label: translate('myTasks'), action: () => {} },
    { icon: Calendar, label: translate('dayPlan'), action: () => {} },
    { icon: Settings, label: translate('settings'), action: () => {} },
    { icon: LogOut, label: translate('logout'), action: () => {} }
  ];

  return (
    <div className={`bg-nav-bg text-white shadow-lg transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-nav-bg/50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center hover:bg-nav-bg/80 p-2 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Logo/Brand */}
      {isExpanded && (
        <div className="p-4 border-b border-nav-bg/50">
          <h2 className="text-lg font-bold text-white">Platforma AI</h2>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-nav-bg/80 transition-colors mb-1 ${
              !isExpanded ? 'justify-center' : ''
            }`}
            title={!isExpanded ? item.label : ''}
          >
            <item.icon className="w-5 h-5 text-white flex-shrink-0" />
            {isExpanded && (
              <span className="text-white font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Language Toggle */}
      <div className="p-2 border-t border-nav-bg/50">
        <button
          onClick={switchLanguage}
          className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-nav-bg/80 transition-colors ${
            !isExpanded ? 'justify-center' : ''
          }`}
          title={!isExpanded ? `${currentLanguage.toUpperCase()}` : ''}
        >
          <Globe className="w-5 h-5 text-white flex-shrink-0" />
          {isExpanded && (
            <span className="text-white font-medium">
              {currentLanguage.toUpperCase()}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default NavigationPanel;