import React, { createContext, useContext, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Temporarily set a default user to bypass authentication
  const [user, setUser] = useState({
    id: 'temp-user',
    email: 'temp@example.com',
    name: 'Temporary User',
    picture: null
  });

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    // Temporarily prevent logout by setting back to default user
    setUser({
      id: 'temp-user',
      email: 'temp@example.com',
      name: 'Temporary User',
      picture: null
    });
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};