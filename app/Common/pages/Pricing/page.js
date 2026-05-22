"use client";
import React, { useState } from "react";

export default function Page() {
  const [data, setData] = useState({
    itemName: "",
    amount: "",
    description: "",
    image: null,
  });
  const [AddItem, setAddItem] = useState(false);

  const handleshow = () => {
    setAddItem(true);
    setData({ ...data, amount: "" });
  };

  const handleselected = (e) => {
    const value = e.target.value;
    if (value === "add") {
      handleshow();
    } else {
      setAddItem(false);
      setData({ ...data, amount: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("itemName", data.itemName);
    formData.append("amount", data.amount);
    formData.append("description", data.description);
    formData.append("image", data.image);

    await fetch("http://localhost:5000/api/prizing/addPrizing", {
      method: "POST",
      body: formData,
    });

    setData({ itemName: "", amount: "", description: "", image: null });
    const files = document.querySelector('input[type="file"]');
    if (files) files.value = "";
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-blue-400/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white border border-indigo-100 rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.08)] px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
            🏷️
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 tracking-tight leading-tight">
              Add Pricing Item
            </h1>
            <p className="text-[12px] text-gray-400 mt-0.5">Fill in the details to add a new item</p>
          </div>
        </div>

        <div className="h-px bg-gray-100 mb-6" />

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Item Name */}
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
              Item Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📦</span>
              <input
                type="text"
                name="itemName"
                value={data.itemName}
                placeholder="Enter item name"
                required
                onChange={(e) => setData({ ...data, itemName: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 border-[1.5px] border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">₹</span>
              <select
                onChange={handleselected}
                value={AddItem ? "add" : data.amount}
                className="w-full pl-8 pr-8 py-2.5 border-[1.5px] border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select amount</option>
                <option value="500">₹ 500</option>
                <option value="5900">₹ 5,900</option>
                <option value="add">+ Add custom amount</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▼</span>
            </div>

            {AddItem && (
              <div className="mt-2.5">
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-500 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2">
                  ✏️ Custom amount
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={data.amount}
                    placeholder="Enter custom amount"
                    onChange={(e) => setData({ ...data, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 border-[1.5px] border-indigo-300 bg-indigo-50/50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={data.description}
              placeholder="Enter a short description..."
              rows={3}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-4 py-2.5 border-[1.5px] border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
              Upload Image
            </label>
            <label className="flex flex-col items-center justify-center border-[1.5px] border-dashed border-indigo-200 rounded-xl px-4 py-5 bg-indigo-50/40 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer text-center group">
              <span className="text-2xl mb-1.5">🖼️</span>
              <span className="text-[12.5px] text-gray-500 font-medium">
                <span className="text-indigo-500 font-semibold group-hover:underline">Click to upload</span> or drag and drop
              </span>
              <span className="text-[11px] text-gray-300 mt-1">PNG, JPG up to 5MB</span>
              <input
                type="file"
                name="image"
                className="hidden"
                onChange={(e) => setData({ ...data, image: e.target.files[0] })}
              />
            </label>
            {data.image && (
              <p className="text-[12px] text-indigo-500 font-medium mt-1.5 flex items-center gap-1.5">
                ✅ {data.image.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 mt-1 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl text-[14px] font-bold tracking-wide shadow-md shadow-indigo-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
          >
            <span>+</span> Add Item
          </button>
        </form>
      </div>
    </div>
  );
}