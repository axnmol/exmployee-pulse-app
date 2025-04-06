/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import axios from "axios"; // Or your preferred API client setup
import { Role } from "../enums/role.enum"; // Import the Role enum

// Define the shape of the user object using the Role enum
interface User {
  userId: string;
  email: string;
  role: Role; // Use the enum here
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean; // For initial auth check AND login process
  login: (token: string) => Promise<void>; // Change signature, make it async
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base URL for the backend API
const API_BASE_URL = "http://localhost:3000"; // Make sure this matches your NestJS port

// Create the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [isLoading, setIsLoading] = useState(true); // Now used for initial load AND login fetch

  // Configure axios instance to include token in headers
  // This should ideally be in a dedicated api client setup file
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem("authToken"); // Get fresh token
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        // Set base URL for all requests
        config.baseURL = API_BASE_URL;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []); // Run only once on mount

  // Effect to check token validity on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        try {
          // Verify token by fetching user profile
          const response = await axios.get<User>(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setUser(response.data); // Set user data from profile
          setToken(storedToken);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("authToken");
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function - Updated Flow
  const login = async (newToken: string) => {
    setIsLoading(true); // Set loading true during login process
    localStorage.setItem("authToken", newToken);
    setToken(newToken);

    try {
      // Immediately fetch profile after getting token
      const response = await axios.get<User>(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      setUser(response.data); // Set user data from profile fetch
      // console.log("Login successful, user profile fetched:", response.data);
    } catch (error) {
      console.error("Failed to fetch profile after login:", error);
      // If profile fetch fails, treat as logout
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
      // Re-throw or handle error appropriately for the login page
      throw error;
    } finally {
      setIsLoading(false); // Set loading false after attempt
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    // console.log("User logged out");
  };

  // Provide the context value
  const value = { user, token, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
