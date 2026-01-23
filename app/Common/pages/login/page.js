// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";

// export default function Page() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const router = useRouter();

//   const handleValues = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/api/login/check", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Invalid credentials");
//         return;
//       }

//       // ✅ Save token in cookie
//       Cookies.set("token", data.token, {
//         expires: 7,
//         sameSite: "strict",
//       });

//       // ✅ Clear form only on success
//       setForm({ email: "", password: "" });

//       router.push("/Common/pages/home");
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     alert("Password reset instructions have been sent to your email!");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">

//         <h1 className="text-3xl font-bold text-center mb-6">
//           Welcome Back
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">

//           <div>
//             <label className="block text-sm font-semibold mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleValues}
//               required
//               className="w-full px-4 py-3 border rounded-xl text-black"
//             />
//           </div>

//           <div>
//             <div className="flex justify-between mb-2">
//               <label className="text-sm font-semibold">Password</label>
//               <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 className="text-sm text-blue-600"
//               >
//                 Forgot Password?
//               </button>
//             </div>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleValues}
//               required
//               className="w-full px-4 py-3 border rounded-xl text-black"
//             />
//           </div>

//           {error && (
//             <p className="text-red-600 text-sm">{error}</p>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//          className="w-full bg-sky-700 text-white py-3 rounded-xl"
//           >
//             {isLoading ? "Signing in..." : "Sign In"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";


export default function Page() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleValues = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      login(form); // 🔥 AuthContext login
      setForm({ username: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleValues}
              required
              className="w-full px-4 py-3 border rounded-xl text-black"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleValues}
              required
              className="w-full px-4 py-3 border rounded-xl text-black"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-700 text-white py-3 rounded-xl"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>
    </div>
  );
}
