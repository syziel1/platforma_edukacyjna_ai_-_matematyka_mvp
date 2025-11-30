import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, MessageSquare, User, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const BookingModal = ({ teacher, slot, subjectId, subjects, onClose, onSubmit }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    subjectId: subjectId || '',
    eventType: 'individual_lesson',
    participantIds: []
  });
  
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };
  
  // Fetch children if user is a guardian
  useEffect(() => {
    const fetchChildren = async () => {
      if (user && user.role === 'guardian') {
        try {
          setLoading(true);
          
          const { data, error } = await supabase
            .from('student_guardians')
            .select(`
              student_id,
              student:profiles!student_guardians_student_id_fkey(
                id,
                first_name,
                last_name
              )
            `)
            .eq('guardian_id', user.id);
          
          if (error) throw error;
          
          setChildren(data.map(item => ({
            id: item.student_id,
            name: `${item.student.first_name} ${item.student.last_name}`
          })));
          
          // Set first child as default if available
          if (data.length > 0) {
            setFormData(prev => ({
              ...prev,
              participantIds: [data[0].student_id]
            }));
          }
        } catch {
          // Silent fail for children fetch
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchChildren();
  }, [user]);
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare participant IDs based on user role
    let participantIds = [];
    
    if (user.role === 'guardian') {
      // For guardian, use selected children
      participantIds = formData.participantIds;
    } else if (user.role === 'student') {
      // For student, use own ID
      participantIds = [user.id];
    }
    
    // Create booking data
    const bookingData = {
      ...formData,
      participantIds,
      // Generate title if not provided
      title: formData.title || `${getEventTypeDisplay(formData.eventType)} - ${subjects.find(s => s.id === formData.subjectId)?.name || ''}`
    };
    
    onSubmit(bookingData);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-text-color">
            {t('bookLesson')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Booking summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">{t('bookingSummary')}</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <span className="font-medium text-blue-700">{t('teacher')}:</span>
                  <span className="text-blue-800 ml-1">{teacher.first_name} {teacher.last_name}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <span className="font-medium text-blue-700">{t('date')}:</span>
                  <span className="text-blue-800 ml-1">{formatDate(slot.start)}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <span className="font-medium text-blue-700">{t('time')}:</span>
                  <span className="text-blue-800 ml-1">{formatTime(slot.start)} - {formatTime(slot.end)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form fields */}
          <div className="space-y-4">
            {/* Subject selection */}
            <div>
              <label className="block text-sm font-medium text-text-color mb-1">
                {t('subject')} *
              </label>
              <div className="relative">
                <select
                  value={formData.subjectId}
                  onChange={(e) => handleInputChange('subjectId', e.target.value)}
                  className="w-full p-3 border border-bg-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 appearance-none bg-white pr-10"
                  required
                >
                  <option value="" disabled>{t('selectSubject')}</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <BookOpen className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-color/50 w-5 h-5 pointer-events-none" />
              </div>
            </div>
            
            {/* Lesson type */}
            <div>
              <label className="block text-sm font-medium text-text-color mb-1">
                {t('lessonType')} *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('eventType', 'individual_lesson')}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                    formData.eventType === 'individual_lesson'
                      ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                      : 'border-bg-neutral text-text-color hover:bg-bg-neutral/50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('individualLesson')}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleInputChange('eventType', 'group_lesson')}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                    formData.eventType === 'group_lesson'
                      ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                      : 'border-bg-neutral text-text-color hover:bg-bg-neutral/50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('groupLesson')}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleInputChange('eventType', 'consultation')}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                    formData.eventType === 'consultation'
                      ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                      : 'border-bg-neutral text-text-color hover:bg-bg-neutral/50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs font-medium">{t('consultation')}</span>
                </button>
              </div>
            </div>
            
            {/* Title (optional) */}
            <div>
              <label className="block text-sm font-medium text-text-color mb-1">
                {t('lessonTitle')} <span className="text-text-color/50">({t('optional')})</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={t('lessonTitlePlaceholder')}
                className="w-full p-3 border border-bg-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              />
            </div>
            
            {/* Participant selection (for guardians only) */}
            {user && user.role === 'guardian' && (
              <div>
                <label className="block text-sm font-medium text-text-color mb-1">
                  {t('bookFor')} *
                </label>
                {loading ? (
                  <div className="p-3 border border-bg-neutral rounded-lg bg-bg-neutral/20">
                    <div className="animate-pulse h-6 bg-bg-neutral rounded"></div>
                  </div>
                ) : children.length > 0 ? (
                  <div className="space-y-2">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`child-${child.id}`}
                          checked={formData.participantIds.includes(child.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('participantIds', [...formData.participantIds, child.id]);
                            } else {
                              handleInputChange('participantIds', formData.participantIds.filter(id => id !== child.id));
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={`child-${child.id}`} className="text-text-color">
                          {child.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border border-bg-neutral rounded-lg bg-yellow-50 text-yellow-700 text-sm">
                    {t('noChildrenLinked')}
                  </div>
                )}
                {formData.participantIds.length === 0 && (
                  <p className="text-red-600 text-xs mt-1">
                    {t('selectAtLeastOneChild')}
                  </p>
                )}
              </div>
            )}
            
            {/* Message (optional) */}
            <div>
              <label className="block text-sm font-medium text-text-color mb-1">
                {t('messageForTeacher')} <span className="text-text-color/50">({t('optional')})</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder={t('messageForTeacherPlaceholder')}
                className="w-full p-3 border border-bg-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 min-h-[100px] resize-none"
              ></textarea>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-bg-neutral text-text-color rounded-lg hover:bg-bg-neutral/50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
              disabled={!formData.subjectId || (user?.role === 'guardian' && formData.participantIds.length === 0)}
            >
              {t('sendBookingRequest')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;