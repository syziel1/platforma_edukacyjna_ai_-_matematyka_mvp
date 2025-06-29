import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PendingRequestsWidget from './PendingRequestsWidget';
import UpcomingEventsWidget from './UpcomingEventsWidget';
import AvailabilityWidget from './AvailabilityWidget';
import GlobalHeader from '../GlobalHeader';

const TeacherDashboardPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is not a teacher
  useEffect(() => {
    if (!loading && (!user || user.role !== 'teacher')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
          <p className="text-text-color">Ładowanie...</p>
        </div>
      </div>
    );
  }

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