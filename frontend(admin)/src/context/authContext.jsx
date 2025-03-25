import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { LOGIN, VALIDATE_TOKEN } from './constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored token on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get(VALIDATE_TOKEN);
          
          if (response.data.success) {
            setIsAuthenticated(true);
            setCurrentUser(response.data.user);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('authToken');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          setIsAuthenticated(false);
          console.error('Token validation error:', error);
          localStorage.removeItem('authToken');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (user) => {
    return axios.post(LOGIN, user)
      .then(response => {
        const { token, user: userData } = response.data;
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setCurrentUser(userData);
        setIsAuthenticated(true);
        return response;
      });
  };

  // Logout function
  const logout = async () => {
    try {
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
    }
  };

  // Check if user has specific permission
  const userHasPermission = (permission) => {
    if (!currentUser || !currentUser.permissions) return false;
    return !!currentUser.permissions[permission];
  };
  

  const value = {
    currentUser,
    loading,
    login,
    logout,
    userHasPermission,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};