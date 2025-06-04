import React, { useState } from 'react';
import { Menu, CheckSquare, Calendar, Settings, LogOut, Globe, LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const NavigationPanel = ({ onLoginClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { translate, switchLanguage, currentLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const handleDayPlan = () => {
    if (user) {
      window.open('https://calendar.google.com', '_blank');
    } else {
      alert('Please log in with Google to access your calendar.');
    }
  };

  const handleTasks = () => {
    if (user) {
      window.open('https://tasks.google.com', '_blank');
    } else {
      alert('Please log in with Google to access your tasks.');
    }
  };

  const menuItems = [
    { 
      icon: CheckSquare, 
      label: translate('myTasks'), 
      action: handleTasks
    },
    { 
      icon: Calendar, 
      label: translate('dayPlan'), 
      action: handleDayPlan 
    },
    { 
      icon: Settings, 
      label: translate('settings'), 
      action: () => {
        alert('Language settings: Click the globe icon below to switch language');
      }
    },
    { 
      icon: user ? LogOut : LogIn, 
      label: user ? translate('logout') : translate('login'), 
      action: user ? logout : onLoginClick
    }
  ];

  const decodeHtmlEntities = (str) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString('<!doctype html><body>' + str, 'text/html');
    return dom.body.textContent || '';
  };

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

      {/* User Info */}
      {isExpanded && user && (
        <div className="p-4 border-b border-nav-bg/50">
          <div className="flex items-center gap-3">
            {user.picture && (
              <img 
                src={user.picture} 
                alt={decodeHtmlEntities(user.name)} 
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="text-sm text-white/70">{translate('welcome')}</p>
              <p className="font-medium text-white overflow-hidden text-ellipsis">
                {decodeHtmlEntities(user.name)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logo/Brand */}
      {isExpanded && (
        <button 
          onClick={() => window.location.href = '/'}
          className="p-4 border-b border-nav-bg/50 hover:bg-nav-bg/80 transition-colors text-left"
        >
          <h2 className="text-lg font-bold text-white">Platforma AI</h2>
        </button>
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