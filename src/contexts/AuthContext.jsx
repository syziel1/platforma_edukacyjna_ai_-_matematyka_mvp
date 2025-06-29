import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider initialized, checking session...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Fetching initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setLoading(false);
          return;
        }
        
        console.log('Session data received:', session ? 'Session exists' : 'No session');
        
        if (session?.user) {
          console.log('User found in session, fetching profile...');
          try {
            // Get user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              if (profileError.code !== 'PGRST116') {
                // PGRST116 is "no rows returned" which is expected for new users
                console.error('Profile fetch error details:', profileError);
              }
            }

            console.log('Profile data:', profile ? 'Profile found' : 'No profile found');
            
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: profile ? `${profile.first_name} ${profile.last_name}` : session.user.email,
              picture: session.user.user_metadata?.avatar_url,
              role: profile?.role,
              profile: profile
            };
            
            console.log('Setting user data in context');
            setUser(userData);
          } catch (error) {
            console.error('Error in profile fetching process:', error);
          }
        } else {
          console.log('No user in session');
        }
      } catch (error) {
        console.error('Error in session initialization:', error);
      } finally {
        console.log('Initial session check completed');
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    console.log('Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        
        try {
          if (session?.user) {
            console.log('User found in updated session, fetching profile...');
            try {
              // Get user profile
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profileError) {
                console.error('Error fetching profile on auth change:', profileError);
                if (profileError.code !== 'PGRST116') {
                  console.error('Profile fetch error details:', profileError);
                }
              }

              console.log('Profile data on auth change:', profile ? 'Profile found' : 'No profile found');
              
              const userData = {
                id: session.user.id,
                email: session.user.email,
                name: profile ? `${profile.first_name} ${profile.last_name}` : session.user.email,
                picture: session.user.user_metadata?.avatar_url,
                role: profile?.role,
                profile: profile
              };
              
              console.log('Setting updated user data in context');
              setUser(userData);
            } catch (error) {
              console.error('Error in profile update process:', error);
            }
          } else {
            console.log('No user in updated session, clearing user data');
            setUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      try {
        console.log('Cleaning up auth subscription');
        subscription.unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing from auth changes:', error);
      }
    };
  }, []);

  const login = (userData) => {
    console.log('Manual login called with user data:', userData.id);
    setUser(userData);
  };

  const logout = async () => {
    console.log('Logout initiated');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      console.log('Successfully signed out from Supabase');
      setUser(null);
      
      // Clear any auth-related localStorage items
      try {
        console.log('Clearing auth-related localStorage items');
        // Don't clear everything as it would remove settings, progress, etc.
        // Just clear specific auth-related items if needed
      } catch (storageError) {
        console.warn('Error clearing localStorage items:', storageError);
      }
      
      console.log('Redirecting to home page');
      window.location.href = '/';
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // Debug current auth state
  useEffect(() => {
    console.log('Auth state updated:', user ? `User ${user.id} logged in` : 'No user logged in');
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};