"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✔️

export default function Page() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const handleValues = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted Data:", form);

    // save data to state
    setSubmittedData(form);

    fetch("http://localhost:5000/api/login/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    })
      .then((response) => response.json()) // parse response JSON
      .then((data) => {
        console.log("Success:", data);
        // Optional: handle API response here
        // e.g., navigate, show message, store token, etc.
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
      });

    // clear input fields AFTER request
    setForm({ email: "", password: "" });

    router.push("/Common/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login
        </h2>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-gray-700 font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            required
            onChange={handleValues}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 text-gray-700 font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            required
            onChange={handleValues}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      {submittedData && (
        <div className="absolute bottom-10 bg-white p-4 rounded-xl shadow-md">
          <p>
            <strong>Email:</strong> {submittedData.email}
          </p>
          <p>
            <strong>Password:</strong> {submittedData.password}
          </p>
        </div>
      )}
    </div>
  );
}
