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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          try {
            // Get user profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: profile ? `${profile.first_name} ${profile.last_name}` : session.user.email,
              picture: session.user.user_metadata?.avatar_url,
              role: profile?.role || 'student',
              profile: profile
            };
            
            setUser(userData);
          } catch {
            // Still set basic user data even if profile fetch fails
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.email,
              role: 'student'
            });
          }
        }
      } catch {
        // Silent fail - just ensure loading is stopped
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          return;
        }
        
        try {
          if (session?.user) {
            try {
              // Get user profile
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              const userData = {
                id: session.user.id,
                email: session.user.email,
                name: profile ? `${profile.first_name} ${profile.last_name}` : session.user.email,
                picture: session.user.user_metadata?.avatar_url,
                role: profile?.role || 'student',
                profile: profile
              };
              
              setUser(userData);
            } catch {
              // Still set basic user data even if profile fetch fails
              setUser({
                id: session.user.id,
                email: session.user.email,
                name: session.user.email,
                role: 'student'
              });
            }
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      try {
        subscription.unsubscribe();
      } catch {
        // Silent fail for cleanup
      }
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      window.location.href = '/';
      return true;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};