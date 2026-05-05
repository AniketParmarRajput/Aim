// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const router = useRouter();

//   // Initialize user from localStorage safely
//   const [user, setUser] = useState(() => {
//     if (typeof window !== "undefined") {
//       try {
//         const storedUser = localStorage.getItem("user");
//         return storedUser ? JSON.parse(storedUser) : null;
//       } catch (err) {
//         console.error("Failed to parse user from localStorage:", err);
//         return null;
//       }
//     }
//     return null;
//   });

//   // Auto logout redirect if user is not logged in
//   useEffect(() => {
//     if (typeof window !== "undefined" && !user) {
//       router.push("/Common/pages/login");
//     }
//   }, [user, router]);

//   // Login function
//   const login = ({ username, password }) => {
//     // Hardcoded credentials for demo
//     if (username === "rajputaniket@1122" && password === "123456") {
//       const userData = { username }; // Only store necessary info
//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//       router.push("/Common/pages/home");
//     } else {
//       alert("Invalid username or password");
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     router.push("/Common/pages/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use AuthContext
// export const useAuth = () => useContext(AuthContext);


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

  // Login
  // const login = ({ username, password }) => {
  //   if (username === "rajputaniket@1122" && password === "123456") {
  //     const userData = { username,password };

  //     setUser(userData);

  //     // Store in cookies (expires in 1 day)
  //     Cookies.set("user", JSON.stringify(userData), { expires: 1 });

  //     router.push("/Common/pages/home");
  //   } else {
  //     alert("Invalid username or password");
  //   }
  // };
const login = async ({ email, password }) => {
  try {
    const res = await fetch("/api/login/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ important
      },
      body: JSON.stringify({ email, password }), // ✅ stringify
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ Save user (or token)
    setUser(data.user);

    // Optional (only if NOT using HTTP-only cookie from backend)
    // Cookies.set("user", JSON.stringify(data.user));

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