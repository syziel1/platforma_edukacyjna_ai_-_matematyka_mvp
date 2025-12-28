import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Settings, Home, Info, BookOpen, BarChart3, PenTool } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SettingsModal from './SettingsModal';
import AboutProjectModal from './AboutProjectModal';
import LearningStatsModal from './LearningStatsModal';
import InteractiveWhiteboard from './InteractiveWhiteboard';

const NavigationPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAboutProject, setShowAboutProject] = useState(false);
  const [showLearningStats, setShowLearningStats] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

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
    setShowWhiteboard(true);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const handleCockpit = () => {
    navigate('/cockpit');
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  const handleLessonsList = () => {
    navigate('/lessons');
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  // Build menu items
  const getMenuItems = () => {
    return [
      { 
        icon: Menu,
        label: t('menu'),
        action: () => setIsExpanded(!isExpanded)
      },
      { 
        icon: Home, 
        label: t('explorerCockpit'), 
        action: handleCockpit,
        isActive: location.pathname === '/cockpit'
      },
      { 
        icon: BookOpen, 
        label: t('lessons'), 
        action: handleLessonsList,
        isActive: location.pathname === '/lessons'
      },
      { 
        icon: BarChart3, 
        label: t('learningStats'), 
        action: handleLearningStats,
        isActive: false
      },
      { 
        icon: PenTool, 
        label: t('whiteboard'), 
        action: handleWhiteboard,
        isActive: false
      },
      { 
        icon: Info, 
        label: t('aboutProject'), 
        action: handleAboutProject,
        isActive: false
      },
      { 
        icon: Settings, 
        label: t('settings'), 
        action: handleSettings,
        isActive: false
      }
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Top Menu Bar - Fixed */}
      <div className="fixed md:hidden top-0 left-0 right-0 bg-nav-bg h-16 flex items-center justify-around px-4 z-50">
        {menuItems.slice(0, 5).map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`text-white p-2 ${item.isActive ? 'bg-white/20 rounded-md' : ''}`}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </div>

      {/* Full Screen Menu (Mobile) / Sidebar (Desktop) - Fixed */}
      <div 
        className={`fixed bg-nav-bg text-white shadow-lg transition-all duration-300 z-50 
          ${isExpanded ? 'w-full md:w-64' : 'w-16'} 
          h-full flex flex-col
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

        {/* Logo/Brand */}
        {isExpanded && (
          <button 
            onClick={() => navigate('/')}
            className="p-4 border-b border-nav-bg/50 hover:bg-nav-bg/80 transition-colors text-left"
          >
            <h2 className="text-lg font-bold text-white">Edu-Future</h2>
          </button>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-2 mt-16 md:mt-0 overflow-y-auto">
          {menuItems.slice(1).map((item, index) => ( // Skip first item (Menu) in sidebar
            <button
              key={index}
              onClick={item.action}
              className={`w-full flex items-center gap-3 p-3 rounded-md hover:bg-nav-bg/80 transition-colors mb-1 ${
                !isExpanded ? 'justify-center' : ''
              } ${item.isActive ? 'bg-white/20' : ''}`}
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