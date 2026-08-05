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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(form);
      setForm({ email: "", password: "" });
      setTimeout(() => {
        setIsLoading(false);
        router.push("/Common/pages/home");
      }, 2500);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const router = useRouter();
  const handleGotoForgetPassword = () => {
    router.push("/Common/pages/ForgetPasswords");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-9 py-9">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-tan to-brand-orange flex items-center justify-center shadow-md text-lg text-white overflow-hidden"><img src="/websitelogo-circle.png" alt="Easy Shop logo" className="w-full h-full object-cover" /></div>
          <span className="text-[16px] font-bold tracking-tight">
            <span className="text-gray-900">Easy</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-tan to-brand-orange">Shop</span>
          </span>
        </div>

        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight mb-1">Log In</h1>
        <p className="text-[13px] text-gray-400 mb-7">Welcome back! Enter your credentials</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">✉</span>
              <input type="email" name="email" value={form.email} onChange={handleValues} placeholder="you@example.com" required className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-semibold text-gray-700">Password</label>
              <button type="button" className="text-[12px] text-brand-orange font-medium hover:underline" onClick={handleGotoForgetPassword}>Forgot password?</button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔒</span>
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleValues} placeholder="••••••••" required className="w-full pl-9 pr-10 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">{showPassword ? "Hide" : "Show"}</button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <span className="text-red-400 text-sm">⚠</span>
              <p className="text-red-600 text-[12.5px] font-medium">{error}</p>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full py-2.5 mt-1 bg-brand-dark text-white rounded-xl text-[14px] font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-center text-[12.5px] text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <span onClick={() => router.push("/")} className="text-brand-orange font-semibold cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}
