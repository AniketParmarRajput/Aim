"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", password: "",
  });

  const imageRef = useRef();
  const [submittedData, setSubmittedData] = useState([]);
  const [edit, setEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleValues = (e) => {
    const { name, type, value, files } = e.target;
    setForm({ ...form, [name]: type === "file" ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    try {
      if (edit !== null) {
        const updatedData = [...submittedData];
        updatedData[edit] = form;
        setSubmittedData(updatedData);
        setEdit(null);
      } else {
        setSubmittedData((prev) => [...prev, form]);
      }

      await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email,
          mobile: form.mobile, password: form.password,
        }),
      });

      setForm({ name: "", email: "", mobile: "", password: "" });
      if (imageRef?.current) imageRef.current.value = null;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all";

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-10 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-8 py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shadow-md shrink-0 text-white text-lg">
              👥
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900 tracking-tight">
                {edit !== null ? "Edit Employee" : "Add New Employee"}
              </h1>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Fill in the details to add to your organization
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-5" />

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Full Name */}
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">👤</span>
                  <input
                    required type="text" name="name"
                    value={form.name} onChange={handleValues}
                    placeholder="John Doe" className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">✉️</span>
                  <input
                    required type="email" name="email"
                    value={form.email} onChange={handleValues}
                    placeholder="john@company.com" className={inputClass}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">📱</span>
                  <input
                    type="tel" name="mobile"
                    value={form.mobile} onChange={handleValues}
                    placeholder="+1 234 567 890" className={inputClass}
                  />
                </div>
              </div>



              {/* Password — full width */}
              <div className="md:col-span-2">
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔒</span>
                  <input
                    required type="password" name="password"
                    value={form.password} onChange={handleValues}
                    placeholder="••••••••" className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl text-[14px] font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>{edit !== null ? "✏️ Update Employee" : "+ Add Employee"}</>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/Common/pages/login")}
                className="px-5 py-2.5 bg-brand-light border border-gray-200 rounded-xl text-[13.5px] font-semibold text-gray-600 hover:border-brand-orange hover:bg-orange-50 hover:text-brand-orange transition-all duration-150"
              >
                Go to Login
              </button>
            </div>

            {/* Cancel edit */}
            {edit !== null && (
              <button
                type="button"
                onClick={() => {
                  setEdit(null);
                  setForm({ name: "", email: "", mobile: "", password: "" });
                }}
                className="w-full mt-3 text-[12.5px] font-semibold text-gray-400 hover:text-brand-orange transition-colors"
              >
                ← Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Success toast */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-5 py-3.5 mt-4 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <span className="text-[13px] font-semibold text-green-700">
              Employese {edit !== null ? "updated" : "added"} successfully!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;