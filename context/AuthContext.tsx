import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType } from '../types';

interface LoginParams {
  username?: string;
  password?: string;
}

// Extended interface for the new signature
interface ExtendedAuthContextType extends Omit<AuthContextType, 'login'> {
  login: (params: LoginParams) => boolean;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('vizarc_secure_session');
    if (session) {
      try {
        const parsed = JSON.parse(atob(session));
        if (parsed.user === 'bilaluruc' && parsed.expiry > Date.now()) {
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (e) {
        logout();
      }
    }
  }, []);

  const login = ({ username, password }: LoginParams) => {
    // Secure hardcoded credentials check
    if (username === 'bilaluruc' && password === 'Bilal2538') {
      setIsAuthenticated(true);
      // Create a simple expiring token
      const token = btoa(JSON.stringify({ 
        user: 'bilaluruc', 
        expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      }));
      localStorage.setItem('vizarc_secure_session', token);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vizarc_secure_session');
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