import { useState, useEffect } from 'react';
import { mentorAvailability } from '../config/mentorAvailability';

export const useMentorStatus = () => {
  const [status, setStatus] = useState('unavailable');
  const [nextAvailability, setNextAvailability] = useState(null);

  useEffect(() => {
    const updateStatus = () => {
      const currentStatus = mentorAvailability.getStatus();
      setStatus(currentStatus);
      
      if (currentStatus !== 'available') {
        const next = mentorAvailability.getNextAvailability();
        setNextAvailability(next);
      } else {
        setNextAvailability(null);
      }
    };

    // Aktualizuj status natychmiast
    updateStatus();

    // Aktualizuj status co minutę
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'unavailable': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'available': return '🟢';
      case 'busy': return '🟡';
      case 'unavailable': return '🔴';
      default: return '⚫';
    }
  };

  const getStatusText = (translate) => {
    switch (status) {
      case 'available': return translate('mentorAvailable');
      case 'busy': return translate('mentorBusy');
      case 'unavailable': return translate('mentorUnavailable');
      default: return translate('mentorUnknown');
    }
  };

  const formatNextAvailability = (translate) => {
    if (!nextAvailability) return '';
    
    const now = new Date();
    const diffMs = nextAvailability.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours < 24) {
      if (diffHours > 0) {
        return translate('nextAvailabilityHours', { hours: diffHours, minutes: diffMins });
      } else {
        return translate('nextAvailabilityMinutes', { minutes: diffMins });
      }
    } else {
      const days = Math.floor(diffHours / 24);
      return translate('nextAvailabilityDays', { days });
    }
  };

  return {
    status,
    nextAvailability,
    getStatusColor,
    getStatusIcon,
    getStatusText,
    formatNextAvailability
  };
};