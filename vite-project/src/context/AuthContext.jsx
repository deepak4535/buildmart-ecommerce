import { createContext, useContext, useEffect, useState } from "react";
import { usersApi } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check logged-in user when application starts
  useEffect(() => {
    const savedUser = localStorage.getItem("constructionUser");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid saved user:", error);
        localStorage.removeItem("constructionUser");
      }
    }

    setLoading(false);
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      const response = await usersApi.getUsers();

      const users = response.data;

      // Check whether email already exists
      const existingUser = users.find(
        (existingUser) =>
          existingUser.email.toLowerCase() ===
          userData.email.toLowerCase()
      );

      if (existingUser) {
        throw new Error("Email is already registered.");
      }

      const newUser = {
        ...userData,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      const result = await usersApi.registerUser(newUser);

      const registeredUser = result.data;

      setUser(registeredUser);

      localStorage.setItem(
        "constructionUser",
        JSON.stringify(registeredUser)
      );

      return registeredUser;
    } catch (error) {
      console.error("Registration error:", error);

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Registration failed."
      );
    }
  };

  // Login existing user
  const login = async (email, password) => {
    try {
      const response = await usersApi.getUsers();

      const users = response.data;

      const loggedInUser = users.find(
        (existingUser) =>
          existingUser.email.toLowerCase() === email.toLowerCase() &&
          existingUser.password === password
      );

      if (!loggedInUser) {
        throw new Error("Invalid email or password.");
      }

      setUser(loggedInUser);

      localStorage.setItem(
        "constructionUser",
        JSON.stringify(loggedInUser)
      );

      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Login failed."
      );
    }
  };

  // Logout current user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("constructionUser");
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing authentication context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export default AuthContext;