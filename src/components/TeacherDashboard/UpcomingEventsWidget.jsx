import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, User, Users, MessageSquare, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const UpcomingEventsWidget = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  // Fetch upcoming events
  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      
      // Get current date in ISO format
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          id,
          title,
          description,
          start_time,
          end_time,
          subject_id,
          event_type,
          participant_ids,
          subjects(name),
          created_by_profile:profiles!calendar_events_created_by_fkey(first_name, last_name)
        `)
        .eq('teacher_id', user.id)
        .eq('status', 'confirmed')
        .gte('start_time', now)
        .order('start_time', { ascending: true })
        .limit(10);

      if (error) throw error;

      // Fetch participant names
      const enrichedData = await Promise.all(data.map(async (event) => {
        let participantNames = [];
        
        if (event.participant_ids && event.participant_ids.length > 0) {
          const { data: participants, error: participantsError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .in('id', event.participant_ids);
          
          if (!participantsError && participants) {
            participantNames = participants.map(p => `${p.first_name} ${p.last_name}`);
          }
        }
        
        return {
          ...event,
          participantNames
        };
      }));

      setUpcomingEvents(enrichedData);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      setError('Nie udało się pobrać nadchodzących wydarzeń');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchUpcomingEvents();
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('calendar_events_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'calendar_events',
        filter: `teacher_id=eq.${user.id}`
      }, (payload) => {
        // Refresh the list when there are changes
        fetchUpcomingEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      dayName: t(`day_${date.getDay()}`),
      isToday: isToday(date),
      isTomorrow: isTomorrow(date)
    };
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if date is tomorrow
  const isTomorrow = (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();
  };

  // Get event type display
  const getEventTypeDisplay = (type) => {
    const types = {
      'individual_lesson': 'Lekcja indywidualna',
      'group_lesson': 'Lekcja grupowa',
      'consultation': 'Konsultacja'
    };
    return types[type] || type;
  };

  // Get event type icon
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'individual_lesson':
        return <User className="w-4 h-4" />;
      case 'group_lesson':
        return <Users className="w-4 h-4" />;
      case 'consultation':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Get event date display
  const getDateDisplay = (dateInfo) => {
    if (dateInfo.isToday) {
      return <span className="font-medium text-green-600">{t('today')}</span>;
    } else if (dateInfo.isTomorrow) {
      return <span className="font-medium text-blue-600">{t('tomorrow')}</span>;
    } else {
      return <span>{dateInfo.date} ({dateInfo.dayName})</span>;
    }
  };

  // Group events by date for calendar view
  const groupEventsByDate = () => {
    const grouped = {};
    
    upcomingEvents.forEach(event => {
      const date = new Date(event.start_time).toLocaleDateString('pl-PL');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    
    return grouped;
  };

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text-color flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-accent-primary" />
          Nadchodzące wydarzenia
        </h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-accent-primary/20 text-accent-primary' : 'text-text-color/60 hover:bg-bg-neutral'}`}
            title="Widok listy"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-1.5 rounded-md ${viewMode === 'calendar' ? 'bg-accent-primary/20 text-accent-primary' : 'text-text-color/60 hover:bg-bg-neutral'}`}
            title="Widok kalendarza"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mb-4"></div>
          <p className="text-text-color/70">Ładowanie wydarzeń...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchUpcomingEvents}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Spróbuj ponownie
          </button>
        </div>
      ) : upcomingEvents.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-blue-700 font-medium mb-1">Brak nadchodzących wydarzeń</p>
          <p className="text-blue-600 text-sm">Twój kalendarz jest pusty na najbliższy czas.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
          {upcomingEvents.map((event) => {
            const startDateTime = formatDateTime(event.start_time);
            const endDateTime = formatDateTime(event.end_time);
            
            return (
              <div 
                key={event.id} 
                className="bg-white border border-bg-neutral rounded-lg p-4 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-accent-primary/10 text-accent-primary">
                        {getEventTypeIcon(event.event_type)}
                      </div>
                      <h3 className="font-semibold text-text-color">{event.title}</h3>
                    </div>
                    <p className="text-sm text-text-color/70">
                      {getEventTypeDisplay(event.event_type)}
                      {event.subjects?.name && ` - ${event.subjects.name}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2 text-sm text-text-color/80">
                  <Clock className="w-4 h-4 text-accent-primary/70" />
                  <div>
                    <div>{getDateDisplay(startDateTime)}</div>
                    <div>{startDateTime.time} - {endDateTime.time}</div>
                  </div>
                </div>
                
                {event.participantNames && event.participantNames.length > 0 && (
                  <div className="text-sm text-text-color/80 flex items-start gap-2">
                    <User className="w-4 h-4 text-accent-primary/70 mt-0.5" />
                    <div>
                      <span className="font-medium">Uczestnicy:</span> {event.participantNames.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Calendar view
        <div className="overflow-y-auto max-h-[500px] pr-1">
          {Object.entries(groupEventsByDate()).map(([date, events]) => (
            <div key={date} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                <h3 className="font-semibold text-text-color">{date}</h3>
              </div>
              
              <div className="space-y-2 pl-4 border-l-2 border-accent-primary/20">
                {events.map(event => {
                  const startTime = new Date(event.start_time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                  const endTime = new Date(event.end_time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <div key={event.id} className="flex items-start gap-2 p-2 hover:bg-bg-neutral/50 rounded-md transition-colors">
                      <div className="text-sm font-medium text-text-color/80 w-16">
                        {startTime}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <div className="p-1 rounded-md bg-accent-primary/10 text-accent-primary">
                            {getEventTypeIcon(event.event_type)}
                          </div>
                          <h4 className="font-medium text-text-color">{event.title}</h4>
                        </div>
                        <p className="text-xs text-text-color/70">
                          {startTime} - {endTime} • {event.participantNames?.join(', ') || 'Brak uczestników'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsWidget;