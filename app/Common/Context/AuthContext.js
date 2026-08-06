"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOGIN_PATH = "/Common/pages/login";
const HOME_PATH = "/Common/pages/home";
const REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // refresh access token every 6 hours (< 7h)

const readUserCookie = () => {
  try {
    const storedUser = Cookies.get("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Failed to parse user from cookies:", err);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize user from cookies
  const [user, setUser] = useState(() => readUserCookie());

  // true while we are checking the session on first load
  const [checking, setChecking] = useState(true);

  // Try to restore / refresh the session using the 7-day refresh token.
  // If it is valid the user goes straight to the app without logging in again.
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/login/refresh`, {
        method: "POST",
        credentials: "include", // send the HTTP-only refresh token cookie
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          Cookies.set("user", JSON.stringify(data.user));
          // If the user lands on the login page but is already logged in -> go to home
          if (pathname === LOGIN_PATH) {
            router.push(HOME_PATH);
          }
          return true;
        }
      } else {
        // Refresh token missing / expired (after 7 days) -> must log in again
        Cookies.remove("user");
        setUser(null);
      }
      return false;
    } catch (err) {
      console.error("Session refresh failed:", err);
      return false;
    }
  }, [pathname, router]);

  // On first load, restore the session before deciding where to redirect.
  useEffect(() => {
    const boot = async () => {
      await refreshSession();
      setChecking(false);
    };
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the access token alive (access token lasts 7h, refresh token 7d).
  // This runs automatically so the user is never asked to log in again within 7 days.
  useEffect(() => {
    const id = setInterval(() => {
      refreshSession();
    }, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [refreshSession]);

  // Redirect to login only AFTER the session check finishes, and only if there is no user.
  useEffect(() => {
    if (!checking && !user) {
      if (pathname !== LOGIN_PATH && pathname !== "/") {
        router.push(LOGIN_PATH);
      }
    }
  }, [checking, user, pathname, router]);

  // Login
  const login = async ({ email, password }) => {
    const res = await fetch(
      `${API_URL}/api/login/check`,
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

    Cookies.set("user", JSON.stringify(data.user));

    return data.user;
  };

  // Logout
  const logout = async () => {
    // Clear the http-only access + refresh token cookies on the server
    try {
      await fetch(`${API_URL}/api/login/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    Cookies.remove("user");

    router.push(LOGIN_PATH);
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);