"use client";

import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "" });
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
      setForm({ name: "", email: "", mobile: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();
  const handleGotoForgetPassword = () => {
    router.push("/Common/pages/ForgetPasswords");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg px-9 py-9">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center shadow-md text-lg text-white">⚡</div>
          <span className="text-[16px] font-bold text-gray-900 tracking-tight">Easy Shop</span>
        </div>

        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight mb-1">Create Account</h1>
        <p className="text-[13px] text-gray-400 mb-7">Fill in your details to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">👤</span>
              <input type="text" name="name" value={form.name} onChange={handleValues} placeholder="John Doe" required className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Email address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">✉</span>
              <input type="email" name="email" value={form.email} onChange={handleValues} placeholder="you@example.com" required className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">📱</span>
              <input type="tel" name="mobile" value={form.mobile} onChange={handleValues} placeholder="+1 234 567 890" required className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-semibold text-gray-700">Password</label>
              <button type="button" className="text-[12px] text-brand-orange font-medium hover:underline" onClick={handleGotoForgetPassword}>Forgot password?</button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔒</span>
              <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleValues} placeholder="••••••••" required className="w-full pl-9 pr-10 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all" />
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
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[11.5px] text-gray-300 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[{ label: "Google", icon: "G" }, { label: "GitHub", icon: "⎔" }].map(({ label, icon }) => (
            <button key={label} type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-[12.5px] font-semibold text-gray-700 hover:border-brand-orange hover:bg-orange-50/50 transition-all">
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        <p className="text-center text-[12.5px] text-gray-400 mt-6">
          Already have an account?{" "}
          <span className="text-brand-orange font-semibold cursor-pointer hover:underline">Log in</span>
        </p>
      </div>
    </div>
  );
}
