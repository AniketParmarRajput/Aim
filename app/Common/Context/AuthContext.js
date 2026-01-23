"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  // ✅ Auto logout redirect
  useEffect(() => {
    if (!user) {
      router.push("/Common/pages/login");
    }
  }, [user]);

  const login = (data) => {
    const { username, password } = data;

    if (username === "rajputaniket@1122" && password === "123456") {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/Common/pages/home");
    } else {
      alert("Invalid username or password");
    }
  };

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

export const useAuth = () => useContext(AuthContext);

