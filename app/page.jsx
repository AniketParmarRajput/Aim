"use client";
import React, { useState } from "react";
import Image from "next/image";

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    passWord: "",
    image: null,
  });

  const [submittedData, setSubmittedData] = useState(null);

  const handleValues = (e) => {
    const { name, type, value, files } = e.target;
    setForm({ ...form, [name]: type === "file" ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(form);
    console.log(form);
    setForm({
      name: "",
      email: "",
      role: "",
      passWord: "",
      image: null,
    })
  }

  const handleClear = () => {
    setSubmittedData(null);
  };

  const handleEdit = () => {
    if (submittedData) {
      setForm(submittedData);
      setSubmittedData(null);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <label className="block font-semibold text-gray-700">Name</label>
        <input
        required
          type="text"
          name="name"
          value={form.name}
          placeholder="Enter Your Name"
          onChange={handleValues}
          className="border rounded p-2 w-full mb-2"
        />

        <label className="block font-semibold text-gray-700">Email</label>
        <input
        required
          type="email"
          name="email"
          value={form.email}
          placeholder="Enter Your Email"
          onChange={handleValues}
          className="border rounded p-2 w-full mb-2"
        />

        <label className="block font-semibold text-gray-700">Role</label>
        <input
        required
          type="text"
          name="role"
          value={form.role}
          placeholder="Enter Your Role"
          onChange={handleValues}
          className="border rounded p-2 w-full mb-2"
        />

        <label className="block font-semibold text-gray-700">Password</label>
        <input
        required
          type="password"
          name="passWord"
          value={form.passWord}
          placeholder="Enter Your Password"
          onChange={handleValues}
          className="border rounded p-2 w-full mb-2"
        />

        <label className="block font-semibold text-gray-700">Upload Image</label>
        <input
      required
          type="file"
          name="image"
          onChange={handleValues}
          className="mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {/* Submitted Data in Table */}
      {submittedData && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Submitted Data:</h2>
          <table className="border border-gray-400 w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-1">Field</th>
                <th className="border px-3 py-1">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-1">Name</td>
                <td className="border px-3 py-1">{submittedData.name}</td>
              </tr>
              <tr>
                <td className="border px-3 py-1">Email</td>
                <td className="border px-3 py-1">{submittedData.email}</td>
              </tr>
              <tr>
                <td className="border px-3 py-1">Role</td>
                <td className="border px-3 py-1">{submittedData.role}</td>
              </tr>
              <tr>
                <td className="border px-3 py-1">Password</td>
                <td className="border px-3 py-1">{submittedData.passWord}</td>
              </tr>
              <tr>
                <td className="border px-3 py-1">Image</td>
                <td className="border px-3 py-1">
                  {submittedData.image ? (
                    <div>
                      <p>{submittedData.image.name}</p>
                      <Image
                        src={URL.createObjectURL(submittedData.image)}
                        alt="Uploaded Preview"
                        className="w-32 h-32 object-cover rounded mt-1 border"
                      />
                    </div>
                  ) : (
                    "No image uploaded"
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleClear}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Clear Data
            </button>

            <button
              onClick={handleEdit}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
