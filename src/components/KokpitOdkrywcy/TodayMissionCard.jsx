import React, { useState, useEffect } from 'react';
import { Clock, Video, Calendar, RotateCcw, User, X } from 'lucide-react';
import { useGlobalTimer } from '../../hooks/useGlobalTimer';
import { mentorAvailability } from '../../config/mentorAvailability';

const TodayMissionCard = ({ mentorSession, onScheduleMentor }) => {
  const { timeElapsed, formattedTime, resetAfterBreak } = useGlobalTimer();
  const [mentorStatus, setMentorStatus] = useState('unavailable');
  const [nextSession, setNextSession] = useState(null);
  
  // Oblicz pozostały czas (cel: 1 godzina nauki)
  const targetTime = 3600; // 1 godzina w sekundach
  const timeRemaining = Math.max(0, targetTime - timeElapsed);

  // Aktualizuj status mentora co minutę
  useEffect(() => {
    const updateMentorStatus = () => {
      const status = mentorAvailability.getStatus();
      setMentorStatus(status);
      
      const nextSessionDate = mentorAvailability.getNextSessionDate();
      setNextSession(nextSessionDate);
    };

    updateMentorStatus();
    const interval = setInterval(updateMentorStatus, 60000); // Co minutę

    return () => clearInterval(interval);
  }, []);

  const getProgressPercentage = () => {
    return (timeElapsed / targetTime) * 100;
  };

  const handleResetTimer = () => {
    if (confirm('Are you sure you want to reset the session timer? This action cannot be undone.')) {
      resetAfterBreak();
    }
  };

  const handleScheduleMentor = () => {
    const nextSessionDate = mentorAvailability.getNextSessionDate();
    if (nextSessionDate) {
      const formattedDate = mentorAvailability.formatSessionDate(nextSessionDate);
      onScheduleMentor({
        name: mentorAvailability.mentorInfo.name,
        title: mentorAvailability.mentorInfo.title,
        date: formattedDate,
        time: '8:30',
        fullDateTime: nextSessionDate, // Dodajemy pełną datę
        zoomLink: 'http://strefaedukacji.zrozoomai.pl/',
        isActive: mentorStatus === 'session-time'
      });
    }
  };

  const handleCancelMeeting = () => {
    if (confirm('Are you sure you want to cancel the scheduled meeting with the mentor?')) {
      onScheduleMentor(null); // Anuluj spotkanie
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getMentorStatusInfo = () => {
    switch (mentorStatus) {
      case 'session-time':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-600',
          icon: '🟢',
          message: 'Meeting in progress - join now!'
        };
      case 'available':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-600',
          icon: '🔵',
          message: 'Available (outside meeting time)'
        };
      case 'busy':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-600',
          icon: '🟡',
          message: 'Busy'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-600',
          icon: '⚫',
          message: 'Unavailable'
        };
    }
  };

  // Funkcja formatująca datę i czas spotkania
  const formatMeetingDateTime = (session) => {
    if (!session || !session.fullDateTime) {
      return { date: session?.date || 'Unknown date', time: session?.time || '8:30' };
    }

    const meetingDate = new Date(session.fullDateTime);
    const now = new Date();
    
    // Sprawdź czy to dzisiaj
    const isToday = meetingDate.toDateString() === now.toDateString();
    
    // Sprawdź czy to jutro
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = meetingDate.toDateString() === tomorrow.toDateString();
    
    let dateText;
    if (isToday) {
      dateText = 'Today';
    } else if (isTomorrow) {
      dateText = 'Tomorrow';
    } else {
      // Formatuj datę w formacie DD.MM.YYYY
      dateText = meetingDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    return {
      date: dateText,
      time: session.time,
      dayName: meetingDate.toLocaleDateString('en-US', { weekday: 'long' })
    };
  };

  const statusInfo = getMentorStatusInfo();

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-color flex items-center gap-2">
          🎯 Your mission for today
        </h2>
        <button
          onClick={handleResetTimer}
          className="text-text-color/50 hover:text-text-color transition-colors p-1 rounded"
          title="Reset session timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      {/* Wskaźnik czasu */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-primary" />
            <span className="font-medium text-text-color">
              {timeRemaining > 0 ? 'Remaining study time:' : 'Goal achieved! 🎉'}
            </span>
          </div>
          <span className="text-2xl font-bold text-accent-primary">
            {timeRemaining > 0 ? formatTime(timeRemaining) : '🏆'}
          </span>
        </div>
        
        {/* Circular progress bar */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getProgressPercentage() >= 100 ? "#22c55e" : "#FFA500"}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(getProgressPercentage(), 100) / 100)}`}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-accent-primary">
              {Math.round(Math.min(getProgressPercentage(), 100))}%
            </span>
          </div>
        </div>

        {/* Informacja o czasie sesji */}
        <div className="text-center text-sm text-text-color/70">
          Session time: {formattedTime}
        </div>
      </div>

      {/* Cel dnia */}
      <div className="mb-6 p-4 bg-accent-secondary/10 rounded-lg border border-accent-secondary/30">
        <p className="text-text-color font-medium">
          <strong>Goal:</strong> Spend one hour learning.
        </p>
      </div>

      {/* Sekcja mentora */}
      <div className="border-t border-bg-neutral pt-4">
        {!mentorSession ? (
          <div className="text-center">
            <div className="mb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <User className="w-6 h-6 text-nav-bg" />
                <span className="font-medium text-text-color">
                  Math Mentor
                </span>
              </div>
              <p className="text-text-color/70 text-sm mb-1">
                No scheduled meetings
              </p>
              <p className="text-text-color/60 text-xs">
                Schedule a meeting with a mentor to receive personalized help
              </p>
            </div>
            <button
              onClick={handleScheduleMentor}
              className="w-full bg-nav-bg text-white py-3 px-6 rounded-lg hover:bg-nav-bg/90 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              SCHEDULE MEETING
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-3">
              <div className="flex items-center justify-center gap-3 mb-2">
                {/* Zdjęcie mentora */}
                <div className="relative">
                  <img 
                    src="/images/Syziel_AIMentor_profile_photo.jpg"
                    alt={mentorSession.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-green-500 shadow-lg"
                  />
                  {/* Status indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusInfo.bgColor} rounded-full border-2 border-white flex items-center justify-center`}>
                    <span className="text-xs text-white">
                      {statusInfo.icon === '🟢' ? '●' : statusInfo.icon === '🔵' ? '●' : statusInfo.icon === '🟡' ? '●' : '●'}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="font-medium text-text-color block">
                    {mentorSession.name}
                  </span>
                  <span className="text-text-color/70 text-xs">
                    {mentorSession.title}
                  </span>
                </div>
              </div>
              
              {/* Zaktualizowane informacje o spotkaniu */}
              {(() => {
                const meetingInfo = formatMeetingDateTime(mentorSession);
                return (
                  <div className="text-text-color font-medium">
                    <p className="text-base">
                      Meeting: {meetingInfo.date} at {meetingInfo.time}
                    </p>
                    {meetingInfo.dayName && meetingInfo.date !== 'Today' && meetingInfo.date !== 'Tomorrow' && (
                      <p className="text-sm text-text-color/70 mt-1">
                        ({meetingInfo.dayName})
                      </p>
                    )}
                  </div>
                );
              })()}
              
              <p className={`text-xs font-medium ${statusInfo.color} mt-1`}>
                {statusInfo.message}
              </p>
            </div>
            
            {/* Przycisk dołączenia do spotkania */}
            <div className="space-y-3">
              <a
                href={mentorSession.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 inline-flex ${
                  mentorSession.isActive 
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  if (!mentorSession.isActive) {
                    e.preventDefault();
                    const meetingInfo = formatMeetingDateTime(mentorSession);
                    alert(`Meeting will be active ${meetingInfo.date} at ${meetingInfo.time}. Currently: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`);
                  }
                }}
              >
                <Video className="w-5 h-5" />
                {mentorSession.isActive ? 'JOIN MEETING' : `MEETING AT ${mentorSession.time}`}
              </a>
            {!mentorSession.isActive && (
              <p className="text-xs text-text-color/60 mt-2">
                Button will be active at {mentorSession.time}
              </p>
            )}
              
              {/* Przycisk anulowania spotkania */}
              <button
                onClick={handleCancelMeeting}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                CANCEL MEETING
              </button>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayMissionCard;