"use client";

import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleValues = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      login(form);
      setForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const router = useRouter();
  const handleGotoForgetPassword = (e) => {
    router.push("/Common/pages/ForgetPasswords"); 
  }

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white border border-indigo-100 rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.08)] px-9 py-9">

        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 text-lg">
            ⚡
          </div>
          <span className="text-[16px] font-bold text-gray-900 tracking-tight">YourBrand</span>
        </div>

        {/* Heading */}
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight mb-1">Welcome back</h1>
        <p className="text-[13px] text-gray-400 mb-7">Sign in to continue to your dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
              Email addressdddddddd
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">✉</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleValues}
                placeholder="you@example.com"
                required
                className="w-full pl-9 pr-4 py-2.5 border-[1.5px] border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-semibold text-gray-700">Password</label>
              <button
                className="text-[12px] text-indigo-500 font-medium hover:underline"
                onClick={handleGotoForgetPassword}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleValues}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-10 py-2.5 border-[1.5px] border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <span className="text-red-400 text-sm">⚠</span>
              <p className="text-red-600 text-[12.5px] font-medium">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-1 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl text-[14px] font-bold tracking-wide shadow-md shadow-indigo-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {isLoading ? "Signing in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[11.5px] text-gray-300 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Google", icon: "G" },
            { label: "GitHub",  icon: "⎔" },
          ].map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 border-[1.5px] border-gray-200 rounded-xl text-[12.5px] font-semibold text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-150"
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* Sign up */}
        <p className="text-center text-[12.5px] text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <span className="text-indigo-500 font-semibold cursor-pointer hover:underline">
            Sign up free
          </span>
        </p>
      </div>
    </div>
  );
}