"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    position: "",
    password: "",
  });

  const imageRef = useRef();
  const [submittedData, setSubmittedData] = useState([]);
  const [edit, setEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleValues = (e) => {
    const { name, type, value, files } = e.target;
    setForm({ ...form, [name]: type === "file" ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update local list (UI)
      if (edit !== null) {
        const updatedData = [...submittedData];
        updatedData[edit] = form;
        setSubmittedData(updatedData);
        setEdit(null);
      } else {
        setSubmittedData((prev) => [...prev, form]);
      }

      // Send JSON request to backend
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          role: form.role,
          position: form.position,
          password: form.password
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      // Reset form
      setForm({
        name: "",
        email: "",
        role: "",
        position: "",
        password: "",
      });

      if (imageRef?.current) {
        imageRef.current.value = null;
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGo = () => {
    router.push("/Common/login");
  };

  const handleEdit = (index) => {
    setForm(submittedData[index]);
    setEdit(index);
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Employee Management System
          </h1>
          <p className="text-lg text-gray-600">
            Add new employees to your organization
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {edit !== null ? "Edit Employee" : "Add New Employee"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="John Doe"
                  onChange={handleValues}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="john.doe@company.com"
                  onChange={handleValues}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <input
                  required
                  type="text"
                  name="role"
                  value={form.role}
                  placeholder="Software Engineer"
                  onChange={handleValues}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position
                </label>
                <input
                  required
                  type="text"
                  name="position"
                  value={form.position}
                  placeholder="Senior Developer"
                  onChange={handleValues}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="••••••••"
                  onChange={handleValues}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  edit !== null ? "Update Employee" : "Add Employee"
                )}
              </button>
              
              <button
                type="button"
                onClick={handleGo}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition duration-200"
              >
                Go to Login
              </button>
            </div>

            {edit !== null && (
              <button
                type="button"
                onClick={() => {
                  setEdit(null);
                  setForm({
                    name: "",
                    email: "",
                    role: "",
                    position: "",
                    password: "",
                  });
                }}
                className="w-full text-gray-500 hover:text-gray-700 transition duration-200 text-sm font-medium"
              >
                ← Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Success Message (Optional) */}
        {submittedData.length > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium">
                Employee {edit !== null ? 'updated' : 'added'} successfully!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;