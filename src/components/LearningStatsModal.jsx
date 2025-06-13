import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, TrendingUp, Award, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGlobalTimer } from '../hooks/useGlobalTimer';

const LearningStatsModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { timeElapsed } = useGlobalTimer();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [learningData, setLearningData] = useState({});

  // Load learning data from localStorage
  useEffect(() => {
    const loadLearningData = () => {
      const saved = localStorage.getItem('dailyLearningStats');
      if (saved) {
        try {
          setLearningData(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading learning data:', error);
          setLearningData({});
        }
      }
    };

    if (isOpen) {
      loadLearningData();
    }
  }, [isOpen]);

  // Save today's learning time when modal opens
  useEffect(() => {
    if (isOpen && timeElapsed > 0) {
      const today = new Date().toISOString().split('T')[0];
      const currentData = { ...learningData };
      
      // Add today's time (convert seconds to minutes)
      const todayMinutes = Math.floor(timeElapsed / 60);
      if (todayMinutes > 0) {
        currentData[today] = (currentData[today] || 0) + todayMinutes;
        setLearningData(currentData);
        localStorage.setItem('dailyLearningStats', JSON.stringify(currentData));
      }
    }
  }, [isOpen, timeElapsed]);

  if (!isOpen) return null;

  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Get calendar data for current month
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Generate 42 days (6 weeks) for calendar grid
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDay.toISOString().split('T')[0];
      const isCurrentMonth = currentDay.getMonth() === month;
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const learningMinutes = learningData[dateStr] || 0;
      
      days.push({
        date: new Date(currentDay),
        dateStr,
        day: currentDay.getDate(),
        isCurrentMonth,
        isToday,
        learningMinutes,
        learningHours: Math.floor(learningMinutes / 60),
        remainingMinutes: learningMinutes % 60
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  // Get learning intensity color
  const getLearningIntensity = (minutes) => {
    if (minutes === 0) return 'bg-gray-100';
    if (minutes < 15) return 'bg-green-100';
    if (minutes < 30) return 'bg-green-200';
    if (minutes < 60) return 'bg-green-300';
    if (minutes < 120) return 'bg-green-400';
    return 'bg-green-500';
  };

  // Calculate statistics
  const calculateStats = () => {
    const currentMonthData = Object.entries(learningData).filter(([date]) => {
      const entryDate = new Date(date);
      return entryDate.getMonth() === currentDate.getMonth() && 
             entryDate.getFullYear() === currentDate.getFullYear();
    });

    const totalMinutes = currentMonthData.reduce((sum, [, minutes]) => sum + minutes, 0);
    const activeDays = currentMonthData.filter(([, minutes]) => minutes > 0).length;
    const averageMinutes = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;
    const longestStreak = calculateLongestStreak();

    return {
      totalHours: Math.floor(totalMinutes / 60),
      totalMinutes: totalMinutes % 60,
      activeDays,
      averageMinutes,
      longestStreak
    };
  };

  // Calculate longest learning streak
  const calculateLongestStreak = () => {
    const sortedDates = Object.keys(learningData)
      .filter(date => learningData[date] > 0)
      .sort();

    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate = null;

    for (const dateStr of sortedDates) {
      const currentDate = new Date(dateStr);
      
      if (lastDate) {
        const dayDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      lastDate = currentDate;
    }
    
    return Math.max(maxStreak, currentStreak);
  };

  const calendarDays = getCalendarData();
  const stats = calculateStats();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-text-color flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-accent-primary" />
            {t('learningStats')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Statistics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                {stats.totalHours}h {stats.totalMinutes}m
              </div>
              <div className="text-sm text-blue-600">Total Time</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
              <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{stats.activeDays}</div>
              <div className="text-sm text-green-600">Active Days</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
              <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">{stats.averageMinutes}m</div>
              <div className="text-sm text-purple-600">Daily Average</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 text-center">
              <Award className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">{stats.longestStreak}</div>
              <div className="text-sm text-orange-600">Longest Streak</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
              <div className="text-2xl font-bold text-yellow-800">
                {Math.floor(timeElapsed / 60)}m
              </div>
              <div className="text-sm text-yellow-600">Today's Session</div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h3 className="text-xl font-bold text-text-color">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-gray-50 rounded-lg p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square p-1 rounded-md border transition-all duration-200 cursor-pointer
                    ${day.isCurrentMonth ? 'border-gray-200' : 'border-transparent'}
                    ${day.isToday ? 'ring-2 ring-accent-primary' : ''}
                    ${getLearningIntensity(day.learningMinutes)}
                    hover:scale-105
                  `}
                  title={`${day.date.toLocaleDateString()}: ${day.learningMinutes} minutes`}
                >
                  <div className={`
                    text-center text-sm font-medium h-full flex flex-col justify-center
                    ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${day.isToday ? 'text-accent-primary font-bold' : ''}
                  `}>
                    <div>{day.day}</div>
                    {day.learningMinutes > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        {day.learningHours > 0 ? `${day.learningHours}h` : ''}
                        {day.remainingMinutes > 0 ? `${day.remainingMinutes}m` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStatsModal;