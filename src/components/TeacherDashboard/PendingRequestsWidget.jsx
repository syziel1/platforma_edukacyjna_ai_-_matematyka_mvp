import React, { useState, useEffect } from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../UI/Toast';

const PendingRequestsWidget = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          id,
          title,
          start_time,
          end_time,
          subject_id,
          event_type,
          participant_ids,
          created_by,
          subjects(name),
          created_by_profile:profiles!calendar_events_created_by_fkey(first_name, last_name)
        `)
        .eq('teacher_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

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

      setPendingRequests(enrichedData);
    } catch {
      setError('Nie udało się pobrać oczekujących próśb o lekcje');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchPendingRequests();
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
        fetchPendingRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // Handle confirm/reject actions
  const handleConfirm = async (eventId) => {
    if (!user) {
      return;
    }

    try {
      const { error } = await supabase
        .from('calendar_events')
        .update({ status: 'confirmed' })
        .eq('id', eventId)
        .eq('teacher_id', user.id);

      if (error) throw error;

      // Update local state
      setPendingRequests(prev => prev.filter(req => req.id !== eventId));
      
      // Show success toast
      setToast({
        show: true,
        message: 'Lekcja została potwierdzona!',
        type: 'success'
      });
    } catch {
      setToast({
        show: true,
        message: 'Nie udało się potwierdzić lekcji',
        type: 'error'
      });
    }
  };

  const handleReject = async (eventId) => {
    if (!user) {
      return;
    }

    try {
      const { error } = await supabase
        .from('calendar_events')
        .update({ status: 'cancelled' })
        .eq('id', eventId)
        .eq('teacher_id', user.id);

      if (error) throw error;

      // Update local state
      setPendingRequests(prev => prev.filter(req => req.id !== eventId));
      
      // Show success toast
      setToast({
        show: true,
        message: 'Lekcja została odrzucona',
        type: 'info'
      });
    } catch {
      setToast({
        show: true,
        message: 'Nie udało się odrzucić lekcji',
        type: 'error'
      });
    }
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      dayName: date.toLocaleDateString('pl-PL', { weekday: 'long' })
    };
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
        return '👨‍🎓';
      case 'group_lesson':
        return '👥';
      case 'consultation':
        return '💬';
      default:
        return '📚';
    }
  };

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral h-full">
      <h2 className="text-xl font-bold text-text-color mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-accent-primary" />
        Oczekujące na akceptację
      </h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mb-4"></div>
          <p className="text-text-color/70">Ładowanie oczekujących próśb...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchPendingRequests}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Spróbuj ponownie
          </button>
        </div>
      ) : pendingRequests.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="text-blue-700 font-medium mb-1">Brak oczekujących próśb</p>
          <p className="text-blue-600 text-sm">Wszystkie prośby o lekcje zostały obsłużone.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => {
            const { date, time, dayName } = formatDateTime(request.start_time);
            
            return (
              <div 
                key={request.id} 
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getEventTypeIcon(request.event_type)}</span>
                      <h3 className="font-semibold text-text-color">{request.title}</h3>
                    </div>
                    <p className="text-sm text-text-color/70">
                      {getEventTypeDisplay(request.event_type)}
                      {request.subjects?.name && ` - ${request.subjects.name}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-color">{date}</p>
                    <p className="text-xs text-text-color/70">{dayName}, {time}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-text-color/80">
                    <span className="font-medium">Zarezerwował:</span> {request.created_by_profile?.first_name} {request.created_by_profile?.last_name}
                  </p>
                  
                  {request.participantNames && request.participantNames.length > 0 && (
                    <p className="text-sm text-text-color/80">
                      <span className="font-medium">Uczestnicy:</span> {request.participantNames.join(', ')}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Odrzuć</span>
                  </button>
                  <button
                    onClick={() => handleConfirm(request.id)}
                    className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Potwierdź</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}
    </div>
  );
};

export default PendingRequestsWidget;