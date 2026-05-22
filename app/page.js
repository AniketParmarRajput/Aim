"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [form, setForm] = useState({
    name: "", email: "", role: "", position: "", password: "",
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
          role: form.role, position: form.position, password: form.password,
        }),
      });

      setForm({ name: "", email: "", role: "", position: "", password: "" });
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
    "w-full pl-9 pr-4 py-2.5 border-[1.5px] border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all";

  return (
    <div className="min-h-screen bg-[#f0f4ff] px-4 py-10 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-blue-400/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.08)] px-8 py-8">

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
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

              {/* Role */}
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">💼</span>
                  <input
                    required type="text" name="role"
                    value={form.role} onChange={handleValues}
                    placeholder="Software Engineer" className={inputClass}
                  />
                </div>
              </div>

              {/* Position */}
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                  Position
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🏅</span>
                  <input
                    required type="text" name="position"
                    value={form.position} onChange={handleValues}
                    placeholder="Senior Developer" className={inputClass}
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
                className="flex-1 py-2.5 bg-linear-to-br from-indigo-500 to-indigo-600 text-white rounded-xl text-[14px] font-bold tracking-wide shadow-md shadow-indigo-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
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
                className="px-5 py-2.5 bg-white border-[1.5px] border-gray-200 rounded-xl text-[13.5px] font-semibold text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-500 transition-all duration-150"
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
                  setForm({ name: "", email: "", role: "", position: "", password: "" });
                }}
                className="w-full mt-3 text-[12.5px] font-semibold text-gray-400 hover:text-indigo-500 transition-colors"
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
              Employee {edit !== null ? "updated" : "added"} successfully!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;