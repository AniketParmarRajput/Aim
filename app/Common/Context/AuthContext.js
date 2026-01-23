"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  // Initialize user from localStorage safely
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        return null;
      }
    }
    return null;
  });

  // Auto logout redirect if user is not logged in
  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      router.push("/Common/pages/login");
    }
  }, [user, router]);

  // Login function
  const login = ({ username, password }) => {
    // Hardcoded credentials for demo
    if (username === "rajputaniket@1122" && password === "123456") {
      const userData = { username }; // Only store necessary info
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      router.push("/Common/pages/home");
    } else {
      alert("Invalid username or password");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/Common/pages/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);


