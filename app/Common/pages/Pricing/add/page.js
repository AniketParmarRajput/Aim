"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Men", "Women", "Childs", "Other"];

export default function AddProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    itemName: "",
    amount: "",
    description: "",
    category: "Men",
    discount: "",
    badge: "none",

    stock: "",
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
    fd.append("stock", form.stock);
    if (form.image) fd.append("image", form.image);

    await fetch("http://localhost:5000/api/prizing/addPrizing", { method: "POST", body: fd });
    router.push("/Common/pages/Pricing");
  };

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shadow-md">
            <span className="text-white text-lg">🏷️</span>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900">Add Product</h1>
            <p className="text-[12px] text-gray-400">Fill in the details to add a new item</p>
          </div>
        </div>

        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-8 py-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Item Name</label>
              <input type="text" value={form.itemName} placeholder="Enter item name" required onChange={(e) => setForm({ ...form, itemName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Price (₹)</label>
              <input type="number" value={form.amount} placeholder="Enter price" required onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea value={form.description} placeholder="Enter a short description..." rows={2} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all resize-none" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange transition-all">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Discount %</label>
              <input type="number" value={form.discount} placeholder="%" onChange={(e) => setForm({ ...form, discount: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange transition-all" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Badge</label>
              <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange transition-all">
                <option value="none">None</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="out of stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Stock Limit</label>
              <input type="number" value={form.stock} placeholder="0" onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Upload Image</label>
              <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl px-4 py-4 bg-brand-cream hover:border-brand-orange hover:bg-orange-50/30 transition-all cursor-pointer text-center group">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-[12.5px] text-gray-500 font-medium"><span className="text-brand-orange font-semibold group-hover:underline">Click to upload</span> or drag and drop</span>
                <input type="file" className="hidden" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} required />
              </label>
              {form.image && <p className="text-[12px] text-brand-orange font-medium mt-1">✅ {form.image.name}</p>}
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl text-[14px] font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                + Add Product
              </button>
              <button type="button" onClick={() => router.back()} className="py-2.5 px-6 border border-gray-200 text-gray-600 rounded-xl text-[14px] font-medium hover:bg-brand-cream transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
