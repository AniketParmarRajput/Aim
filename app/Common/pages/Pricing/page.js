"use client";
import React, { useState } from "react";

const CATEGORIES = ["Men", "Women", "Childs", "Other"];

export default function Page() {
  const [form, setForm] = useState({
    itemName: "",
    amount: "",
    description: "",
    category: "Men",
    discount: "",
    badge: "none",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("itemName", form.itemName);
    fd.append("amount", form.amount);
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("discount", form.discount);
    fd.append("badge", form.badge);
    if (form.image) fd.append("image", form.image);

    await fetch("http://localhost:5000/api/prizing/addPrizing", {
      method: "POST",
      body: fd,
    });

    setForm({ itemName: "", amount: "", description: "", category: "Men", discount: "", badge: "none", image: null });
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white text-lg">🏷️</span>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900 tracking-tight leading-tight">Add Product</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">Fill in the details to add a new item</p>
          </div>
        </div>

        <div className="h-px bg-gray-100 mb-6" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Item Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📦</span>
              <input type="text" value={form.itemName} placeholder="Enter item name" required onChange={(e) => setForm({ ...form, itemName: e.target.value })} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Price (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input type="number" value={form.amount} placeholder="Enter price" required onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} placeholder="Enter a short description..." rows={3} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-white transition-all resize-none" />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 focus:outline-none focus:border-brand-orange transition-all">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="w-28">
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Discount %</label>
              <input type="number" value={form.discount} placeholder="%" onChange={(e) => setForm({ ...form, discount: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 focus:outline-none focus:border-brand-orange transition-all" />
            </div>
            <div className="w-24">
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Badge</label>
              <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 focus:outline-none focus:border-brand-orange transition-all">
                <option value="none">None</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Upload Image</label>
            <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl px-4 py-5 bg-gray-50 hover:border-brand-orange hover:bg-orange-50/30 transition-all cursor-pointer text-center group">
              <span className="text-2xl mb-1.5">🖼️</span>
              <span className="text-[12.5px] text-gray-500 font-medium"><span className="text-brand-orange font-semibold group-hover:underline">Click to upload</span> or drag and drop</span>
              <span className="text-[11px] text-gray-300 mt-1">PNG, JPG up to 5MB</span>
              <input type="file" className="hidden" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
            </label>
            {form.image && <p className="text-[12px] text-brand-orange font-medium mt-1.5 flex items-center gap-1.5">✅ {form.image.name}</p>}
          </div>

          <button type="submit" className="w-full py-2.5 mt-1 bg-brand-dark text-white rounded-xl text-[14px] font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span>+</span> Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
