import axios from "axios";
import { createContext, useEffect, useState } from "react";

// Create authentication context
export const AuthContext = createContext();

// Authentication context provider component
export const AuthContexProvider = ({ children }) => {
  // Get user from localStorage or set to null if not found
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Login function to handle user authentication
  const login = async (inputs) => {
    const res = await axios.post("/auth/login", inputs);
    setCurrentUser(res.data);
  };

  // Logout function to handle user logout
  const logout = async (inputs) => {
    await axios.post("/auth/logout");
    setCurrentUser(null);
  };

  // Save user to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  // Provide auth context to children components
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
