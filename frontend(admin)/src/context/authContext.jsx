import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  ADMIN,
  GET_PERMISSIONS,
  VALIDATE_TOKEN,
} from "./constants";

import { hasPermission } from "../utils/permissions";
import { useNotification } from "./notificationContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUserID, setCurrentUserID] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);

  const { showNotification } = useNotification();

  // Check for stored token on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const response = await axios.get(VALIDATE_TOKEN);

          if (response.data.success) {
            setIsAuthenticated(true);
            setCurrentUserID(response.data.userId);
            const permissionResponse = await axios.get(
              `${GET_PERMISSIONS}/${response.data.userId}`
            );
            console.log(permissionResponse);
            setUserPermissions(permissionResponse.data.data);
          } else {
            console.log("setting isAuthenticated to false");
            setIsAuthenticated(false);
            localStorage.removeItem("authToken");
            delete axios.defaults.headers.common["Authorization"];
          }
        } catch (error) {
          setIsAuthenticated(false);
          console.error("Token validation error:", error);
          localStorage.removeItem("authToken");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (user) => {
    try {
      const result = await axios.post(`${ADMIN}/login`, user);
      if (result.data.success) {
        const { token, permissions, userId } = result.data;
        setUserPermissions(permissions);
        localStorage.setItem("authToken", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setCurrentUserID(userId);
        setIsAuthenticated(true);
        return { success: true, message: result.data.message };
      } else {
        return { success: false, message: result.data.message };
      }
    } catch (error) {
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || "Login failed",
        };
      }
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  };

  const handlePermissionCheck = (requiredPermission, action, message) => {
    if (!hasPermission(userPermissions, requiredPermission)) {
      showNotification(
        message || "You don't have permission to perform this action",
        "warning"
      );
      return;
    }
    // Execute the actual action if they have permission
    action();
  };

  // Logout function
  const logout = async () => {
    try {
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      setCurrentUserID(null);
    }
  };

  const value = {
    currentUserID,
    loading,
    login,
    logout,
    isAuthenticated,
    userPermissions,
    handlePermissionCheck,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
