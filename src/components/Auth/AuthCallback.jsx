import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    console.log('AuthCallback component mounted');
    
    const handleAuthCallback = async () => {
      try {
        console.log('Processing auth callback...');
        
        // Get the session from the URL
        console.log('Getting session from Supabase...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_callback_failed');
          return;
        }

        console.log('Session data received:', data.session ? 'Session exists' : 'No session');

        if (data.session) {
          const user = data.session.user;
          console.log('User found in session, ID:', user.id);
          
          // Get or create user profile
          console.log('Fetching user profile...');
          let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          console.log('Profile fetch result:', profileError ? `Error: ${profileError.message}` : 'Profile found');

          // If profile doesn't exist, create it (for OAuth users)
          if (profileError && profileError.code === 'PGRST116') {
            console.log('Profile not found, creating new profile');
            const role = searchParams.get('role') || 'student';
            
            console.log('Creating profile with role:', role);
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                first_name: user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.name || '',
                last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
                role: role,
                phone_number: user.user_metadata?.phone || ''
              })
              .select()
              .single();

            if (createError) {
              console.error('Profile creation error:', createError);
              navigate('/login?error=profile_creation_failed');
              return;
            }

            console.log('New profile created successfully');
            profile = newProfile;
          }

          // Update auth context
          console.log('Updating auth context with user data');
          login({
            id: user.id,
            email: user.email,
            name: profile ? `${profile.first_name} ${profile.last_name}` : user.email,
            picture: user.user_metadata?.avatar_url,
            role: profile?.role,
            profile: profile
          });

          // Redirect based on user role
          if (profile?.role === 'teacher') {
            console.log('Redirecting to teacher dashboard');
            navigate('/teacher-dashboard');
          } else {
            console.log('Redirecting to cockpit');
            navigate('/cockpit');
          }
        } else {
          console.log('No session found, redirecting to login');
          navigate('/login?error=no_session');
        }
      } catch (error) {
        console.error('Auth callback unexpected error:', error);
        navigate('/login?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [navigate, login, searchParams]);

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
        <p className="text-text-color">Logowanie w toku...</p>
      </div>
    </div>
  );
};

export default AuthCallback;