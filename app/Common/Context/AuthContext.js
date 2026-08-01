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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/login/check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ Very important for HTTP-only cookies
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // ✅ Save user
  setUser(data.user);

  // Optional (only if you're not relying solely on HTTP-only cookies)
  Cookies.set("user", JSON.stringify(data.user));

  return data.user;
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

