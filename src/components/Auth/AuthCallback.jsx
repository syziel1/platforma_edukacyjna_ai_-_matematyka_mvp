import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          navigate('/login?error=auth_callback_failed');
          return;
        }

        if (data.session) {
          const user = data.session.user;
          
          // Get or create user profile
          let profile = null;
          let profileError = null;
          
          try {
            const result = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
              
            profile = result.data;
            profileError = result.error;
          } catch {
            // Continue with profile creation even if fetch fails
          }

          // If profile doesn't exist, create it (for OAuth users)
          if (!profile || (profileError && profileError.code === 'PGRST116')) {
            const role = searchParams.get('role') || 'student';
            
            try {
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

              if (!createError) {
                profile = newProfile;
              }
            } catch {
              // Continue even if profile creation fails
            }
          }

          // Update auth context with whatever data we have
          login({
            id: user.id,
            email: user.email,
            name: profile ? `${profile.first_name} ${profile.last_name}` : user.email,
            picture: user.user_metadata?.avatar_url,
            role: profile?.role || 'student', // Default to student if no role
            profile: profile
          });

          // Redirect based on user role
          if (profile?.role === 'teacher') {
            navigate('/teacher-dashboard');
          } else {
            navigate('/cockpit');
          }
        } else {
          navigate('/login?error=no_session');
        }
      } catch {
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