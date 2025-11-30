import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock, BookOpen, AlertCircle, User, Users, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import GlobalHeader from '../components/GlobalHeader';
import BookingModal from '../components/BookingModal';
import { useLanguage } from '../contexts/LanguageContext';

const TeacherCalendarPage = () => {
  const { id: teacherId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [teacher, setTeacher] = useState(null);
  const [teacherSubjects, setTeacherSubjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        
        // Fetch teacher profile
        const { data: teacherData, error: teacherError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', teacherId)
          .eq('role', 'teacher')
          .single();
        
        if (teacherError) throw teacherError;
        if (!teacherData) throw new Error('Nauczyciel nie został znaleziony');
        
        setTeacher(teacherData);
        
        // Fetch teacher subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('teacher_subjects')
          .select(`
            subject_id,
            subjects(id, name)
          `)
          .eq('teacher_id', teacherId);
        
        if (subjectsError) throw subjectsError;
        setTeacherSubjects(subjectsData);
        
        // Set default selected subject if available
        if (subjectsData && subjectsData.length > 0) {
          setSelectedSubject(subjectsData[0].subject_id);
        }
        
        // Fetch available slots for the selected date
        await fetchAvailableSlots(selectedDate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);
  
  // Fetch available slots for a specific date
  const fetchAvailableSlots = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      const { data, error } = await supabase.rpc('get_available_time_slots', {
        p_teacher_id: teacherId,
        p_target_date: formattedDate,
        p_slot_duration_minutes: 60 // Default to 1-hour slots
      });
      
      if (error) throw error;
      
      setAvailableSlots(data || []);
    } catch {
      setError('Nie udało się pobrać dostępnych terminów');
    }
  };
  
  // Navigate to previous/next day
  const navigateDay = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
    fetchAvailableSlots(newDate);
  };
  
  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };
  
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Handle slot selection
  const handleSlotSelect = (slot) => {
    if (!user) {
      // Redirect to login if not logged in
      if (confirm(t('loginToBook'))) {
        navigate('/login');
      }
      return;
    }
    
    // Calculate end time (1 hour after start time)
    const startTime = new Date(slot);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);
    
    setSelectedSlot({
      start: startTime,
      end: endTime
    });
    setShowBookingModal(true);
  };
  
  // Handle booking submission
  const handleBookingSubmit = async (bookingData) => {
    try {
      // Close modal first to improve perceived performance
      setShowBookingModal(false);
      
      // Create calendar event
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          teacher_id: teacherId,
          subject_id: bookingData.subjectId,
          title: bookingData.title || `Lekcja - ${teacherSubjects.find(s => s.subject_id === bookingData.subjectId)?.subjects.name}`,
          description: bookingData.message || '',
          start_time: selectedSlot.start.toISOString(),
          end_time: selectedSlot.end.toISOString(),
          event_type: bookingData.eventType || 'individual_lesson',
          status: 'pending',
          participant_ids: bookingData.participantIds || [],
          created_by: user.id
        });
      
      if (error) throw error;
      
      // Show success message
      alert(t('bookingRequestSent'));
      
      // Refresh available slots
      fetchAvailableSlots(selectedDate);
    } catch {
      alert(t('bookingError'));
    }
  };
  
  // Get event type display
  const getEventTypeDisplay = (type) => {
    const types = {
      'individual_lesson': t('individualLesson'),
      'group_lesson': t('groupLesson'),
      'consultation': t('consultation')
    };
    return types[type] || type;
  };
  
  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <GlobalHeader 
        title={teacher ? `${teacher.first_name} ${teacher.last_name}` : t('teacherCalendar')}
        showBackButton={true}
        onBack={() => navigate('/teachers')}
      />
      
      <div className="flex-1 p-4 md:p-6 mt-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mb-4"></div>
              <p className="text-text-color/70">{t('loadingTeacherData')}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium mb-2">{error}</p>
              <button
                onClick={() => navigate('/teachers')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t('backToTeachersList')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Teacher profile - Left column */}
              <div className="lg:col-span-1">
                <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
                  <div className="flex items-center gap-4 mb-6">
                    {/* Teacher avatar */}
                    <div className="w-20 h-20 bg-accent-primary/20 rounded-full flex items-center justify-center text-accent-primary text-2xl font-bold">
                      {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                    </div>
                    
                    <div>
                      <h2 className="font-bold text-text-color text-xl">
                        {teacher.first_name} {teacher.last_name}
                      </h2>
                      <p className="text-text-color/70">
                        {t('teacher')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subjects */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-color mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent-primary" />
                      {t('teachesSubjects')}
                    </h3>
                    
                    <div className="space-y-2">
                      {teacherSubjects.length > 0 ? (
                        teacherSubjects.map((ts, index) => (
                          <div 
                            key={index}
                            className="flex items-center p-3 bg-white rounded-lg border border-bg-neutral"
                          >
                            <span className="text-text-color">{ts.subjects.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-text-color/50 italic">
                          {t('noSubjectsAssigned')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Subject selection for booking */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-color mb-3">
                      {t('selectSubjectForBooking')}
                    </h3>
                    
                    <select
                      value={selectedSubject || ''}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full p-3 border border-bg-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                      disabled={teacherSubjects.length === 0}
                    >
                      {teacherSubjects.length === 0 ? (
                        <option value="">{t('noSubjectsAvailable')}</option>
                      ) : (
                        teacherSubjects.map((ts, index) => (
                          <option key={index} value={ts.subject_id}>
                            {ts.subjects.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  {/* Contact info */}
                  {teacher.phone_number && (
                    <div className="p-4 bg-accent-primary/10 rounded-lg border border-accent-primary/30">
                      <p className="text-sm text-text-color">
                        <span className="font-medium">{t('contactPhone')}:</span> {teacher.phone_number}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Calendar - Right column */}
              <div className="lg:col-span-2">
                <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-color flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-accent-primary" />
                      {t('availabilityCalendar')}
                    </h2>
                    
                    {/* Date navigation */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateDay(-1)}
                        className="p-2 hover:bg-bg-neutral rounded-md transition-colors"
                        title={t('previousDay')}
                      >
                        <ChevronLeft className="w-5 h-5 text-text-color" />
                      </button>
                      
                      <button
                        onClick={() => {
                          const today = new Date();
                          setSelectedDate(today);
                          fetchAvailableSlots(today);
                        }}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          isToday(selectedDate) 
                            ? 'bg-accent-primary text-white' 
                            : 'bg-bg-neutral text-text-color hover:bg-bg-neutral/80'
                        }`}
                      >
                        {t('today')}
                      </button>
                      
                      <button
                        onClick={() => navigateDay(1)}
                        className="p-2 hover:bg-bg-neutral rounded-md transition-colors"
                        title={t('nextDay')}
                      >
                        <ChevronRight className="w-5 h-5 text-text-color" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Selected date display */}
                  <div className="mb-6 text-center">
                    <h3 className="text-lg font-semibold text-text-color">
                      {formatDate(selectedDate)}
                    </h3>
                  </div>
                  
                  {/* Time slots */}
                  <div className="space-y-4">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, index) => {
                        const slotTime = new Date(slot);
                        return (
                          <button
                            key={index}
                            onClick={() => handleSlotSelect(slot)}
                            className="w-full p-4 bg-white border border-bg-neutral rounded-lg hover:border-accent-primary hover:bg-accent-primary/5 transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-accent-primary" />
                              <span className="font-medium text-text-color">
                                {formatTime(slot)}
                              </span>
                            </div>
                            <span className="text-sm text-accent-primary font-medium">
                              {t('bookThisSlot')}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <p className="text-yellow-700 font-medium mb-1">{t('noAvailableSlots')}</p>
                        <p className="text-yellow-600 text-sm">{t('tryDifferentDate')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Booking Modal */}
      {showBookingModal && selectedSlot && (
        <BookingModal
          teacher={teacher}
          slot={selectedSlot}
          subjectId={selectedSubject}
          subjects={teacherSubjects.map(ts => ts.subjects)}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default TeacherCalendarPage;