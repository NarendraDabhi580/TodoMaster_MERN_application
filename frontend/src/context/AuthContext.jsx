import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Auth verification failed:", error.message);
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
    setIsAuthenticated(true); // Optimistic update
    try {
      const { data } = await axiosInstance.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      console.error("Login verification failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
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
