import React, { createContext, useContext, useState, useEffect, use } from 'react';
import axios from 'axios';
import { ADD_ORACLE_USER, GET_PERMISSIONS, LOGIN, VALIDATE_TOKEN } from './constants';
import { useNotification } from './notificationContext';
import { hasPermission } from '../utils/permissions';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUserID, setCurrentUserID] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);

  const {showNotification} = useNotification();

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
            setCurrentUserID(response.data.userId);
            const permissionResponse = await axios.get(`${GET_PERMISSIONS}/${response.data.userId}`);
            setUserPermissions(permissionResponse.data.data);
          } else {
            console.log("setting isAuthenticated to false");
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
        const { token, permissions, userId } = response.data;
        setUserPermissions(permissions);
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setCurrentUserID(userId);
        setIsAuthenticated(true);
        return response;
      });
  };

  const handlePermissionCheck = (requiredPermission, action, message)=>{
    if (!hasPermission(userPermissions, requiredPermission)) {
          showNotification(
            message || "You don't have permission to perform this action",
            "warning"
          );
          return;
        }
        // Execute the actual action if they have permission
        action();
  }

  // Logout function
  const logout = async () => {
    try {
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUserID(null);
    }
  };


  const createOracleUser = async (userData) => {
    const response = await axios.post(ADD_ORACLE_USER, userData);
    if (response.data.success) {
      console.log(response.data.message);
      return response.data;
    }else{
      console.log(response.data.message);
      return null;
    }
  }
  

  const value = {
    currentUserID,
    loading,
    login,
    logout,
    isAuthenticated,
    createOracleUser,
    userPermissions,
    handlePermissionCheck
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};