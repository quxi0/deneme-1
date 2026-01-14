import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('vizarc_session');
    if (session === 'active') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string) => {
    // Hardcoded for demo purposes. Real app would use an API.
    if (password === 'password') {
      setIsAuthenticated(true);
      localStorage.setItem('vizarc_session', 'active');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vizarc_session');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
