"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  
  const router = useRouter();

  const handleValues = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Submitted Data:", form);

    // Save data to state
    setSubmittedData(form);

    try {
      const response = await fetch("http://localhost:5000/api/login/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      console.log("Success:", data);
      
      // Clear input fields AFTER request
      setForm({ email: "", password: "" });
      
      // Navigate to home page
      router.push("/Common/pages/home");
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Password reset instructions have been sent to your email!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                required
                onChange={handleValues}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition duration-200"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                required
                onChange={handleValues}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Dont have an account?
              <button className="text-blue-600 hover:text-blue-700 font-medium transition duration-200">
                Contact Administrator
              </button>
            </p>
          </div>
        </div>

        {/* Success Message */}
        {submittedData && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-800 font-medium">Login successful!</p>
                <p className="text-green-700 text-sm">Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
