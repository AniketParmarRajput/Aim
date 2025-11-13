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

  const [submittedData, setSubmittedData] = useState([]);
  const [edit,setEdit]=useState(null)

  const handleValues = (e) => {
    const { name, type, value, files } = e.target;
    setForm({ ...form, [name]: type === "file" ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(edit !== null ){
      const updatedData = [...submittedData];
      updatedData[edit] = form;
      setSubmittedData(updatedData)
      setEdit({
      name: "",
      email: "",
      role: "",
      passWord: "",
      image: null,
    });
    }
    else{ setSubmittedData((prev) => [...prev, form]);
    console.log(form);
    setForm({
      name: "",
      email: "",
      role: "",
      passWord: "",
      image: null,
    });
  }
  };
  const handleEdit = (index) => {
    setForm(submittedData[index]);
    setEdit(index)
  }
  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
  }

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

        <label className="block font-semibold text-gray-700">
          Upload Image
        </label>
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
      {submittedData.map((data, index) => (
        <div key={index}>
          {Object.entries(data).map(([key, value], i) => (
            <p key={i}>
              <strong>{key}:</strong>{" "}
              {key === "image" && value ? (
                <Image
                  src={URL.createObjectURL(value)}
                  alt="Uploaded"
                  width={80}
                  height={80}
                />
              ) : (
                String(value)
              )}
            </p>
          ))}
          <button onClick={() =>handleEdit(index)}>Edit</button>
           <button onClick={() =>handleDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Page;
