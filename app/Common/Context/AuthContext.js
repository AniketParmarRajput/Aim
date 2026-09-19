"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const LOGIN_PATH = "/Common/pages/login";
const HOME_PATH = "/Common/pages/home";
const REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // refresh every 6h (<7h access expiry)

// ============ HELPERS ============

const readUserCookie = () => {
  try {
    const storedUser = Cookies.get("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    console.error("Failed to parse user from cookies:", err);
    return null;
  }
};

// Decode JWT payload without verifying signature (client-side expiry check only)
// Real verification is done on backend via /verify or refresh
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true; // no exp => assume valid
    const nowSec = Math.floor(Date.now() / 1000);
    // keep 30s buffer before expiry
    return payload.exp > nowSec + 30;
  } catch {
    return false;
  }
};

const saveTokensToCookies = (data) => {
  const accessToken = data.accessToken || data.token;
  if (accessToken) {
    // js-cookie expires in days: 7h = 7/24
    Cookies.set("access_token", accessToken, { expires: 7 / 24, sameSite: "lax", path: "/" });
    Cookies.set("token", accessToken, { expires: 7 / 24, sameSite: "lax", path: "/" }); // alias
  }
  if (data.refreshToken) {
    Cookies.set("refresh_token", data.refreshToken, { expires: 7, sameSite: "lax", path: "/" });
  }
};

const clearClientCookies = () => {
  Cookies.remove("user");
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("token");
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(() => readUserCookie());
  const [checking, setChecking] = useState(true);

  const getAccessToken = useCallback(() => Cookies.get("access_token") || Cookies.get("token") || null, []);
  const getRefreshToken = useCallback(() => Cookies.get("refresh_token") || null, []);

  // ------- Step: Is access token valid? (server verify) -------
  const verifyAccessToken = useCallback(async () => {
    const token = getAccessToken();
    // 1) fast client-side check
    if (token && isTokenValid(token)) {
      // optionally double-check with backend (uncomment if you want strict server verification)
      // const res = await fetch(`${API_URL}/api/login/verify`, {
      //   method: "GET",
      //   credentials: "include",
      //   headers: token ? { Authorization: `Bearer ${token}` } : {},
      // });
      // return res.ok;
      return true;
    }
    // 2) fallback: try server verify (handles httpOnly cookie even if js cookie missing)
    try {
      const res = await fetch(`${API_URL}/api/login/verify`, {
        method: "GET",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.ok;
    } catch {
      return false;
    }
  }, [getAccessToken]);

  // ------- Step: Is refresh token available? -> Call refresh API -------
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/login/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          Cookies.set("user", JSON.stringify(data.user), { sameSite: "lax", path: "/" });
          saveTokensToCookies(data);
          if (pathname === LOGIN_PATH) router.push(HOME_PATH);
          return true;
        }
      }
      // refresh failed = refresh missing/expired
      clearClientCookies();
      setUser(null);
      return false;
    } catch (err) {
      console.error("Session refresh failed:", err);
      return false;
    }
  }, [pathname, router]);

  // ------- Main Flow: Application starts -> Is access valid? -> YES continue | NO -> refresh -------
  const initializeAuth = useCallback(async () => {
    // Flow diagram implementation:
    // Application starts
    //   ↓
    // Is access token valid?
    //   YES → continue
    //   NO / missing
    //     ↓
    //   Is refresh token available?
    //     YES → Call refresh API → Get new access token → Continue
    //     NO  → redirect to login

    const hasAccess = await verifyAccessToken();

    if (hasAccess) {
      // YES → continue, ensure user state is populated from cookie
      const storedUser = readUserCookie();
      if (storedUser) {
        setUser(storedUser);
        if (pathname === LOGIN_PATH) router.push(HOME_PATH);
      } else {
        // edge: token valid but user cookie missing -> try refresh to repopulate user
        await refreshSession();
      }
      return;
    }

    // NO / missing -> Is refresh token available?
    // We check both js cookie and httpOnly via attempt
    const refreshToken = getRefreshToken();
    const hasRefreshCookie = !!refreshToken;

    // Even if js refresh missing, httpOnly refreshToken might exist, so we still attempt once
    // If truly no refresh at all and server will 401, we skip call to save request
    // To strictly follow diagram: only call refresh if refresh is available
    // Here we try server refresh regardless because httpOnly is invisible to JS
    // If you want strict: if (!hasRefreshCookie) { clear and return false }
    if (!hasRefreshCookie) {
      // Try server refresh anyway - it will 401 if httpOnly also missing, but we can avoid extra call
      // Check if we should attempt: we attempt because httpOnly may exist
      const refreshed = await refreshSession();
      if (!refreshed) {
        // NO refresh -> will redirect via effect below
        clearClientCookies();
        setUser(null);
      }
      return;
    }

    // YES refresh available → Call refresh API
    const refreshed = await refreshSession();
    if (refreshed) {
      // Get new access token → Continue application
      return;
    }
    // refresh failed → must login
    clearClientCookies();
    setUser(null);
  }, [verifyAccessToken, getRefreshToken, refreshSession, pathname, router]);

  // On first load - run flowchart before deciding redirect
  useEffect(() => {
    const boot = async () => {
      await initializeAuth();
      setChecking(false);
    };
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep token alive (6h < 7h) - silent refresh
  useEffect(() => {
    const id = setInterval(() => {
      // only refresh if user exists, otherwise skip
      if (Cookies.get("user")) refreshSession();
    }, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [refreshSession]);

  // Redirect to login only after checking finishes and no user
  useEffect(() => {
    if (!checking && !user) {
      if (pathname !== LOGIN_PATH && pathname !== "/") {
        router.push(LOGIN_PATH);
      }
    }
  }, [checking, user, pathname, router]);

  // Login - saves access_token + refresh_token to cookies (JS-accessible)
  const login = async ({ email, password }) => {
    const res = await fetch(`${API_URL}/api/login/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setUser(data.user);
    Cookies.set("user", JSON.stringify(data.user), { sameSite: "lax", path: "/" });
    saveTokensToCookies(data);
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/login/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    clearClientCookies();
    router.push(LOGIN_PATH);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        checking,
        login,
        logout,
        getAccessToken,
        getRefreshToken,
        refreshSession,
        verifyAccessToken,
        isTokenValid,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
