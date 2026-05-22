"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  // Initialize user from cookies
  const [user, setUser] = useState(() => {
    try {
      const storedUser = Cookies.get("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Failed to parse user from cookies:", err);
      return null;
    }
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/Common/pages/login");
    }
  }, [user, router]);
  console.log("Current user:", user);

  // Login
const login = async ({ email, password }) => {
  try {
   const res = await fetch("http://localhost:5000/api/login/check", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",   // ✅ VERY IMPORTANT
  body: JSON.stringify({ email, password }),
});
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ Save user (or token)
    setUser(data.user);

    // // Optional (only if NOT using HTTP-only cookie from backend)
    Cookies.set("user", JSON.stringify(data.user));

    router.push("/Common/pages/home");
  } catch (err) {
    alert(err.message);
  }
};
  // Logout
  const logout = () => {
    setUser(null);

    // Remove cookie
    Cookies.remove("user");

    router.push("/Common/pages/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

