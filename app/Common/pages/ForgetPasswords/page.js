"use client"
import React, { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

 const handleSubmit = async (e) => {
  e.preventDefault();

  setSuccess(false);

  // Validate Email
  if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  setError("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/employees/update-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    setSuccess(true);

    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error.message);
    setError(error.message);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-sm shadow-sm">

        {/* Header */}
        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Forgot your password?</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Enter your email and will send you a link to reset it.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">
              Email address
            </label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                  if (success) setSuccess(false);
                }}
                className={`w-full pl-9 pr-4 py-2.5 border-[1.5px] rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white ${
                  error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                }`}
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 text-sm text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reset link sent! Check your inbox.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-orange-50 text-orange-600 border-[1.5px] border-orange-200 rounded-xl text-[13px] font-bold hover:bg-orange-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Send Reset Link
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Remember it?{" "}
          <a href="/login" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
            Back to sign in
          </a>
        </p>

      </div>
    </div>
  );
};

export default Page;
