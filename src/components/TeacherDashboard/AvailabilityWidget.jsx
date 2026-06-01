import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../UI/Toast';

const AvailabilityWidget = () => {
  const { user } = useAuth();
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00'
  });

  // Day of week mapping
  const daysOfWeek = [
    { value: 1, label: 'Poniedziałek' },
    { value: 2, label: 'Wtorek' },
    { value: 3, label: 'Środa' },
    { value: 4, label: 'Czwartek' },
    { value: 5, label: 'Piątek' },
    { value: 6, label: 'Sobota' },
    { value: 0, label: 'Niedziela' }
  ];

  // Fetch availability slots
  const fetchAvailabilitySlots = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('teacher_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      setAvailabilitySlots(data);
    } catch {
      setError('Nie udało się pobrać harmonogramu dostępności');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchAvailabilitySlots();
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    // Validate time range
    if (formData.startTime >= formData.endTime) {
      setToast({
        show: true,
        message: 'Czas rozpoczęcia musi być wcześniejszy niż czas zakończenia',
        type: 'error'
      });
      return;
    }

    try {
      if (editingSlot) {
        // Update existing slot
        const { error } = await supabase
          .from('availability_slots')
          .update({
            day_of_week: formData.dayOfWeek,
            start_time: formData.startTime,
            end_time: formData.endTime
          })
          .eq('id', editingSlot.id)
          .eq('teacher_id', user.id);

        if (error) throw error;
        
        setToast({
          show: true,
          message: 'Slot dostępności został zaktualizowany',
          type: 'success'
        });
      } else {
        // Create new slot
        const { error } = await supabase
          .from('availability_slots')
          .insert({
            teacher_id: user.id,
            day_of_week: formData.dayOfWeek,
            start_time: formData.startTime,
            end_time: formData.endTime
          });

        if (error) throw error;
        
        setToast({
          show: true,
          message: 'Nowy slot dostępności został dodany',
          type: 'success'
        });
      }

      // Reset form and close modal
      setFormData({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00'
      });
      setEditingSlot(null);
      setShowModal(false);
      
      // Refresh data
      fetchAvailabilitySlots();
    } catch {
      setToast({
        show: true,
        message: 'Nie udało się zapisać slotu dostępności',
        type: 'error'
      });
    }
  };

  // Handle slot deletion
  const handleDelete = async (slotId) => {
    if (!user) {
      return;
    }

    if (!confirm('Czy na pewno chcesz usunąć ten slot dostępności?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('availability_slots')
        .delete()
        .eq('id', slotId)
        .eq('teacher_id', user.id);

      if (error) throw error;
      
      // Update local state
      setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
      
      setToast({
        show: true,
        message: 'Slot dostępności został usunięty',
        type: 'info'
      });
    } catch {
      setToast({
        show: true,
        message: 'Nie udało się usunąć slotu dostępności',
        type: 'error'
      });
    }
  };

  // Open edit modal
  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      dayOfWeek: slot.day_of_week,
      startTime: slot.start_time.substring(0, 5), // Format HH:MM
      endTime: slot.end_time.substring(0, 5)
    });
    setShowModal(true);
  };

  // Open add modal
  const handleAdd = () => {
    setEditingSlot(null);
    setFormData({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00'
    });
    setShowModal(true);
  };

  // Group slots by day of week
  const groupedSlots = availabilitySlots.reduce((acc, slot) => {
    const day = slot.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {});

  return (
    <div className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text-color flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent-primary" />
          Zarządzaj swoją dostępnością
        </h2>
        
        <button
          onClick={handleAdd}
          className="p-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
          title="Dodaj nowy slot dostępności"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mb-4"></div>
          <p className="text-text-color/70">Ładowanie harmonogramu dostępności...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchAvailabilitySlots}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Spróbuj ponownie
          </button>
        </div>
      ) : availabilitySlots.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-3xl mb-2">⏰</div>
          <p className="text-blue-700 font-medium mb-1">Brak zdefiniowanych godzin dostępności</p>
          <p className="text-blue-600 text-sm mb-4">Dodaj swoje godziny pracy, aby umożliwić rezerwację lekcji.</p>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj godziny dostępności</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
          {daysOfWeek.map((day) => (
            <div key={day.value} className="border-b border-bg-neutral pb-3 last:border-b-0 last:pb-0">
              <h3 className="font-medium text-text-color mb-2">{day.label}</h3>
              
              {groupedSlots[day.value]?.length > 0 ? (
                <div className="space-y-2 pl-2">
                  {groupedSlots[day.value].map((slot) => (
                    <div 
                      key={slot.id} 
                      className="flex items-center justify-between bg-white p-2 rounded-md border border-bg-neutral"
                    >
                      <div className="text-sm text-text-color">
                        {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(slot)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edytuj"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(slot.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Usuń"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-color/60 italic pl-2">Brak zdefiniowanych godzin</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-text-color">
                {editingSlot ? 'Edytuj slot dostępności' : 'Dodaj nowy slot dostępności'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-4">
                {/* Day of Week */}
                <div>
                  <label className="block text-sm font-medium text-text-color mb-1">
                    Dzień tygodnia
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                    className="w-full p-2 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-color mb-1">
                      Czas rozpoczęcia
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full p-2 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-color mb-1">
                      Czas zakończenia
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full p-2 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-bg-neutral text-text-color rounded-md hover:bg-bg-neutral transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/90 transition-colors"
                >
                  {editingSlot ? 'Zapisz zmiany' : 'Dodaj slot'}
                </button>
              </div>
            </form>
          </div>
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

export default AvailabilityWidget;