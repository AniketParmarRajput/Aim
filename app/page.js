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
    password: "", // only for frontend display if needed
  });

  const imageRef = useRef();
  const [submittedData, setSubmittedData] = useState([]);
  const [edit, setEdit] = useState(null);
  const router = useRouter();

  const handleValues = (e) => {
    const { name, type, value, files } = e.target;
    setForm({ ...form, [name]: type === "file" ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
    fetch("http://localhost:5000/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        role: form.role,
        position: form.position,
        password:form.password // Backend requires this
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Server response:", data))
      .catch((err) => console.error("Error submitting form:", err));

    // Reset form
    setForm({
      name: "",
      email: "",
      role: "",
      position: "",
      passWord: "",
    });

    if (imageRef?.current) {
      imageRef.current.value = null;
    }
  };
  const handleGo = () => {
    router.push("/Common/login");
  }

  const handleEdit = (index) => {
    setForm(submittedData[index]);
    setEdit(index);
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Employee Details Form
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Name</label>
            <input
              required
              type="text"
              name="name"
              value={form.name}
              placeholder="Enter Your Name"
              onChange={handleValues}
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email</label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              placeholder="Enter Your Email"
              onChange={handleValues}
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Role</label>
            <input
              required
              type="text"
              name="role"
              value={form.role}
              placeholder="Enter Your Role"
              onChange={handleValues}
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Position</label>
            <input
              required
              type="text"
              name="position"
              value={form.position}
              placeholder="Job Position"
              onChange={handleValues}
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password</label>
            <input
              required
              type="password"
              name="password"
              value={form.password}
              placeholder="Enter Password"
              onChange={handleValues}
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          {edit !== null ? "Update" : "Submit"}
        </button>
        <button
          type="button"
          onClick={handleGo}
          className="mt-4 ml-4 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200"
        >
          Go to Login
        </button>
      </form>

      {/* Submitted Data */}
      {submittedData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Employee List</h2>
          <div className="space-y-4">
            {submittedData.map((data, index) => (
              <div
                key={index}
                className="border rounded p-4 flex flex-col md:flex-row items-center md:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>Email:</strong> {data.email}</p>
                    <p><strong>Role:</strong> {data.role}</p>
                    <p><strong>Position:</strong> {data.position}</p>
                    <p><strong>Password:</strong> {data.password}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

