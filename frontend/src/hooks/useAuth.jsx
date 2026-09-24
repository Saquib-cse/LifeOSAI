import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lifeos_token') || null);
  const [isDemoMode, setIsDemoMode] = useState(localStorage.getItem('lifeos_demo') === 'true');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          if (token === 'demo-token-123') {
            setUser({ id: 'demo-user-123', name: 'Mohammed', email: 'demo@lifeos.ai' });
            setIsDemoMode(true);
          } else {
            const data = await api.getMe();
            setUser(data.user);
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('lifeos_token', data.token);
    localStorage.removeItem('lifeos_demo');
    setToken(data.token);
    setUser(data.user);
    setIsDemoMode(false);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.register({ name, email, password });
    localStorage.setItem('lifeos_token', data.token);
    localStorage.removeItem('lifeos_demo');
    setToken(data.token);
    setUser(data.user);
    setIsDemoMode(false);
    return data;
  };

  const enterDemoMode = async () => {
    try {
      const data = await api.demoLogin();
      localStorage.setItem('lifeos_token', data.token);
      localStorage.setItem('lifeos_demo', 'true');
      setToken(data.token);
      setUser(data.user);
      setIsDemoMode(true);
      return data;
    } catch (error) {
      // Offline/Local fallback demo login
      const fallbackToken = 'demo-token-123';
      const fallbackUser = { id: 'demo-user-123', name: 'Mohammed', email: 'demo@lifeos.ai' };
      localStorage.setItem('lifeos_token', fallbackToken);
      localStorage.setItem('lifeos_demo', 'true');
      setToken(fallbackToken);
      setUser(fallbackUser);
      setIsDemoMode(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('lifeos_token');
    localStorage.removeItem('lifeos_demo');
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
  };

  const resetDemoData = async () => {
    try {
      await api.resetDemoData();
      window.location.reload();
    } catch (error) {
      console.error('Reset demo data failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isDemoMode,
        loading,
        login,
        register,
        enterDemoMode,
        logout,
        resetDemoData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
