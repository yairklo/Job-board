import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    try {
      const decodedUser = jwtDecode(token);
      // Check if token is expired
      if (decodedUser.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUser(decodedUser);
      }
    } catch (error) {
      console.error('Invalid token', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      login(token);
    }
    setIsLoading(false);
  }, [login]);

  const isLoggedIn = !!user;
  const isRecruiter = user?.isRecruiter || false;
  const isAdmin = user?.isAdmin || false;

  const value = {
    user,
    isLoading,
    login,
    logout,
    isLoggedIn,
    isRecruiter,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
