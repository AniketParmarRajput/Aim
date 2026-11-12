"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LOGIN_PATH = "/Common/pages/login";
const HOME_PATH = "/Common/pages/home";

// ======================================
// JWT HELPERS
// ======================================

const getTokenPayload = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    );

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  if (!token) return false;

  const payload = getTokenPayload(token);

  if (!payload) return false;
  if (!payload.exp) return true;

  const now = Math.floor(Date.now() / 1000);

  return payload.exp > now + 10;
};

// ======================================
// AUTH PROVIDER
// ======================================

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [checking, setChecking] = useState(true);

  // Latest access token
  const accessTokenRef = useRef(null);

  // Prevent duplicate refresh API calls
  const refreshPromiseRef = useRef(null);

  // Update access token
  const updateAccessToken = useCallback((token) => {
    accessTokenRef.current = token;
    setAccessToken(token);
  }, []);

  // ======================================
  // REFRESH SESSION
  // ======================================

  const refreshSession = useCallback(async () => {

    // If refresh already running, reuse same request
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const run = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/login/refresh`,
          {
            method: "POST",

            // Only refresh API sends cookies
            credentials: "include",

            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {

          if (
            response.status === 401 ||
            response.status === 403
          ) {
            updateAccessToken(null);
            setUser(null);
          }

          return false;
        }

        const data = await response.json();

        const newToken =
          data.accessToken || data.token;

        if (!newToken) {
          console.error(
            "Refresh API did not return accessToken"
          );

          return false;
        }

        // Update token in memory
        updateAccessToken(newToken);

        // Backend should return user as well
        if (data.user) {
          setUser(data.user);
        }

        console.log("Access token refreshed successfully");

        return true;

      } catch (error) {
        console.error("Refresh API failed:", error);
        return false;
      }
    };

    refreshPromiseRef.current = run();

    try {
      return await refreshPromiseRef.current;
    } finally {
      refreshPromiseRef.current = null;
    }

  }, [updateAccessToken]);

  // ======================================
  // AUTHORIZED API REQUEST
  // ======================================

  const authFetch = useCallback(
    async (url, options = {}) => {

      // Refresh token if missing or expired
      let currentToken = accessTokenRef.current;

      if (!currentToken || !isTokenValid(currentToken)) {

        const refreshed = await refreshSession();

        if (!refreshed) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Session expired. Please login again.",
            }),
            {
              status: 401,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        currentToken = accessTokenRef.current;
      }

      // Build request
      const buildOptions = () => {
        const headers = new Headers(options.headers || {});

        headers.set(
          "Authorization",
          `Bearer ${accessTokenRef.current}`
        );

        return {
          ...options,
          headers,

          // Never send cookies to normal APIs
          credentials: "omit",
        };
      };

      // Remember token used in this request
      const tokenUsed = currentToken;

      // First request
      let response = await fetch(url, buildOptions());

      // Handle unauthorized request
      if (response.status === 401) {

        // Another request may already have refreshed it
        if (accessTokenRef.current === tokenUsed) {

          const refreshed = await refreshSession();

          if (!refreshed) {
            updateAccessToken(null);
            setUser(null);

            return response;
          }
        }

        // Retry only once with latest token
        response = await fetch(url, buildOptions());
      }

      return response;
    },
    [refreshSession, updateAccessToken]
  );

  // ======================================
  // VERIFY ACCESS TOKEN
  // ======================================

  const verifyAccessToken = useCallback(async () => {
    const token = accessTokenRef.current;

    if (!token || !isTokenValid(token)) {
      return false;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/login/verify`,
        {
          method: "GET",
          credentials: "omit",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.ok;

    } catch (error) {
      console.error("Verify API error:", error);
      return false;
    }
  }, []);

  // ======================================
  // LOGIN
  // ======================================

  const login = async ({ email, password }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/login/check`,
        {
          method: "POST",

          // Allow backend to set HttpOnly refresh cookie
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token =
        data.accessToken || data.token;

      if (!token) {
        throw new Error("Access token missing");
      }

      // Store access token only in memory
      updateAccessToken(token);

      setUser(data.user || null);

      router.push(HOME_PATH);

      return data.user;

    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // ======================================
  // LOGOUT
  // ======================================

  const logout = async () => {
    try {
      await fetch(
        `${API_URL}/api/login/logout`,
        {
          method: "POST",

          // Send refresh cookie for backend logout
          credentials: "include",
        }
      );

    } catch (error) {
      console.error("Logout error:", error);
    }

    updateAccessToken(null);
    setUser(null);

    router.push(LOGIN_PATH);
  };

  // ======================================
  // INITIAL AUTH CHECK
  // ======================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // On page reload, access token is lost.
        // Use refresh cookie to obtain a new access token.
        const refreshed = await refreshSession();

        if (!mounted) return;

        if (!refreshed) {
          updateAccessToken(null);
          setUser(null);
        }

      } catch (error) {
        console.error("Initial auth error:", error);

        if (mounted) {
          updateAccessToken(null);
          setUser(null);
        }

      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };

  }, [refreshSession, updateAccessToken]);

  // ======================================
  // ROUTE REDIRECT
  // ======================================

  useEffect(() => {
    if (checking) return;

    if (
      !user &&
      pathname !== LOGIN_PATH &&
      pathname !== "/"
    ) {
      router.replace(LOGIN_PATH);
    }

    if (user && pathname === LOGIN_PATH) {
      router.replace(HOME_PATH);
    }

  }, [checking, user, pathname, router]);

  // ======================================
  // AUTH CONTEXT
  // ======================================

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        checking,

        login,
        logout,

        authFetch,
        refreshSession,
        verifyAccessToken,
        isTokenValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ======================================
// CUSTOM HOOK
// ======================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
