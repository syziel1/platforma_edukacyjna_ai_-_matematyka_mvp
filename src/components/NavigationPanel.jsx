import React, { useState } from 'react';
import { Menu, Calendar, Settings, LogOut, LogIn, Home, Info, BookOpen, BarChart3, PenTool } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import SettingsModal from './SettingsModal';
import AboutProjectModal from './AboutProjectModal';
import LearningStatsModal from './LearningStatsModal';
import InteractiveWhiteboard from './InteractiveWhiteboard';

const NavigationPanel = ({ onLoginClick, onShowCockpit, onShowStartScreen }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAboutProject, setShowAboutProject] = useState(false);
  const [showLearningStats, setShowLearningStats] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const handleDayPlan = () => {
    if (user) {
      window.open('https://calendar.google.com', '_blank');
    } else {
      alert(t('signInToAccess'));
    }
  };

  const handleSettings = () => {
    setShowSettings(true);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const handleAboutProject = () => {
    setShowAboutProject(true);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const handleLearningStats = () => {
    setShowLearningStats(true);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const handleWhiteboard = () => {
/*    if (user) {*/
      setShowWhiteboard(true);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
/*    } else {
      alert(t('signInToAccess'));
    }*/
  };

  const handleCockpit = () => {
    if (onShowCockpit) {
      onShowCockpit();
    }
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const handleStartScreen = () => {
    if (onShowStartScreen) {
      onShowStartScreen();
    }
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  // Build menu items dynamically based on user login status
  const getMenuItems = () => {
    const baseItems = [
      { 
        icon: Menu,
        label: t('menu'),
        action: () => setIsExpanded(!isExpanded)
      },
      // Explorer Cockpit available for everyone
      { 
        icon: Home, 
        label: t('explorerCockpit'), 
        action: handleCockpit
      },
      // StartScreen - lessons list
      { 
        icon: BookOpen, 
        label: t('lessonsList'), 
        action: handleStartScreen
      }
    ];

    // Add Day Plan only if user is logged in
    if (user) {
      baseItems.push({
        icon: Calendar, 
        label: t('dayPlan'), 
        action: handleDayPlan 
      });
    }

    // Add Interactive Whiteboard only if user is logged in
    if (user) {
      baseItems.push({
        icon: PenTool,
        label: t('interactiveWhiteboard'),
        action: handleWhiteboard
      });
    }

    // Add remaining items
    baseItems.push(
      {
        icon: BarChart3,
        label: t('learningStats'),
        action: handleLearningStats
      },
      { 
        icon: Info, 
        label: t('aboutProject'), 
        action: handleAboutProject
      },
      { 
        icon: Settings, 
        label: t('settings'), 
        action: handleSettings
      },
      { 
        icon: user ? LogOut : LogIn, 
        label: user ? t('logout') : t('login'), 
        action: user ? logout : onLoginClick
      }
    );

    return baseItems;
  };

  const menuItems = getMenuItems();

  const decodeHtmlEntities = (str) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString('<!doctype html><body>' + str, 'text/html');
    return dom.body.textContent || '';
  };

  return (
    <>
      {/* Mobile Top Menu Bar */}
      <div className="fixed md:hidden top-0 left-0 right-0 bg-nav-bg h-16 flex items-center justify-around px-4 z-40">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.action();
              if (index !== 0) { // Don't close menu when clicking menu toggle
                setIsExpanded(false);
              }
            }}
            className="text-white p-2"
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </div>

      {/* Full Screen Menu (Mobile) / Sidebar (Desktop) */}
      <div 
        className={`fixed md:relative bg-nav-bg text-white shadow-lg transition-all duration-300 z-50 
          ${isExpanded ? 'w-full md:w-64' : 'w-16'} 
          min-h-screen flex flex-col
          ${isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
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
                <p className="text-sm text-white/70">{t('welcome')}</p>
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
            <h2 className="text-lg font-bold text-white">Edu-Future</h2>
          </button>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-2 mt-16 md:mt-0">
          {menuItems.slice(1).map((item, index) => ( // Skip first item (Menu) in sidebar
            <button
              key={index}
              onClick={() => {
                item.action();
                if (window.innerWidth < 768) {
                  setIsExpanded(false);
                }
              }}
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
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* About Project Modal */}
      <AboutProjectModal 
        isOpen={showAboutProject} 
        onClose={() => setShowAboutProject(false)} 
      />

      {/* Learning Statistics Modal */}
      <LearningStatsModal 
        isOpen={showLearningStats} 
        onClose={() => setShowLearningStats(false)} 
      />

      {/* Interactive Whiteboard Modal */}
      <InteractiveWhiteboard 
        isOpen={showWhiteboard} 
        onClose={() => setShowWhiteboard(false)} 
      />
    </>
  );
};

export default NavigationPanel;