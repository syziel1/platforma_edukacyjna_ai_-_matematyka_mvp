import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PendingRequestsWidget from './PendingRequestsWidget';
import UpcomingEventsWidget from './UpcomingEventsWidget';
import AvailabilityWidget from './AvailabilityWidget';
import GlobalHeader from '../GlobalHeader';

const TeacherDashboardPage = () => {
  // Logowanie wyłączone: nie sprawdzamy usera ani nie przekierowujemy

  if (!user || user.role !== 'teacher') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <GlobalHeader 
        title={`Kokpit nauczyciela - ${user.name}`}
        showBackButton={false}
      />
      
      <div className="flex-1 p-4 md:p-6 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Pending Requests */}
            <div className="lg:col-span-1">
              <PendingRequestsWidget />
            </div>
            
            {/* Middle Column - Upcoming Events */}
            <div className="lg:col-span-1">
              <UpcomingEventsWidget />
            </div>
            
            {/* Right Column - Availability Management */}
            <div className="lg:col-span-1">
              <AvailabilityWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;