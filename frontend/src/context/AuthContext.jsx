import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import axiosInstance from "../api/axiosInstance";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verify authentication on app load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setUser(response.data.user); // Backend returns { message, user }
        setIsAuthenticated(true);
      } catch (error) {
        // Only log error if it's not a 401 (unauthorized)
        if (error.response?.status !== 401) {
          console.error("Auth verification error:", error);
        }
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data on login:", error);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, setUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
