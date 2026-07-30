"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const CATEGORIES = ["Men", "Women", "Childs", "Other"];

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    itemName: "",
    amount: "",
    description: "",
    category: "Men",
    discount: "",
    badge: "none",
    colour: "",
    stock: "",
    sku: "",
    active: true,
    image: null,
    imageUrl: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing/${id}`);
        const result = await res.json();
        const p = result.data;
        if (p) {
          setForm({
            itemName: p.itemName || "",
            amount: p.amount || "",
            description: p.description || "",
            category: p.category || "Men",
            discount: p.discount || "",
            badge: p.badge || "none",
            colour: p.colour || "",
            stock: p.stock ?? "",
            sku: p.sku || "",
            active: p.active !== false,
            image: null,
            imageUrl: "",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("itemName", form.itemName);
    fd.append("amount", form.amount);
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("discount", form.discount);
    fd.append("badge", form.badge);
    fd.append("colour", form.colour);
    fd.append("stock", form.stock);
    fd.append("active", form.active);
    if (form.image) fd.append("image", form.image);
    if (form.imageUrl) fd.append("imageUrl", form.imageUrl);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/updatePrizing/${id}`, { method: "PUT", body: fd });
    router.push("/Common/pages/Pricing");
  };

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-md">
            <span className="text-white text-lg">✏️</span>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900">Edit Product</h1>
            <p className="text-[12px] text-gray-400">Update the product details</p>
          </div>
        </div>

        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-8 py-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Item Name</label>
              <input type="text" value={form.itemName} required onChange={(e) => setForm({ ...form, itemName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Price (₹)</label>
              <input type="number" value={form.amount} required onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea value={form.description} rows={2} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all resize-none" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange transition-all">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Discount %</label>
              <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange transition-all" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Badge</label>
              <select value={form.badge} onChange={(e) => {
                const val = e.target.value;
                if (val === "out of stock") setForm({ ...form, badge: val, stock: "0" });
                else if (val === "limited stock") setForm({ ...form, badge: val, stock: form.stock || "1" });
                else setForm({ ...form, badge: val });
              }} className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange transition-all">
                <option value="none">None</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="limited stock">Limited Stock</option>
                <option value="out of stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">SKU Code</label>
              <div className="flex items-center gap-2 bg-brand-cream border border-gray-200 rounded-xl px-3 py-2.5">
                <span className="text-[13.5px] font-mono font-bold text-brand-dark">{form.sku || <span className="text-gray-300 font-normal">-</span>}</span>
              </div>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Colour</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.colour || "#000000"} onChange={(e) => setForm({ ...form, colour: e.target.value })} className="w-10 h-10 rounded-xl border border-gray-200 bg-brand-cream cursor-pointer p-0.5" />
                <input type="text" value={form.colour} placeholder="#000000" onChange={(e) => setForm({ ...form, colour: e.target.value })} className="flex-1 px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Stock Limit</label>
              <input type="number" value={form.stock} onChange={(e) => {
                const s = Number(e.target.value);
                setForm({ ...form, stock: e.target.value, badge: s === 0 && form.badge !== "out of stock" ? "out of stock" : s > 0 && s <= 5 && form.badge !== "limited stock" ? "limited stock" : s > 5 && (form.badge === "limited stock" || form.badge === "out of stock") ? "none" : form.badge });
              }} required={form.badge === "limited stock" || form.badge === "out of stock"} className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange transition-all" />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Status</label>
              <button type="button" onClick={() => setForm({ ...form, active: !form.active })} className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 ${form.active ? "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100" : "bg-red-50 text-red-500 border-2 border-red-200 hover:bg-red-100"}`}>
                {form.active ? "Active" : "Inactive"}
              </button>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Image URL (leave empty to keep current)</label>
              <input type="url" value={form.imageUrl} placeholder="https://example.com/image.jpg" onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Or upload Image (leave empty to keep current)</label>
              <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl px-4 py-4 bg-brand-cream hover:border-brand-orange hover:bg-orange-50/30 transition-all cursor-pointer text-center group">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-[12.5px] text-gray-500 font-medium"><span className="text-brand-orange font-semibold group-hover:underline">Click to upload</span> new image</span>
                <input type="file" className="hidden" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
              </label>
              {form.image && <p className="text-[12px] text-brand-orange font-medium mt-1">✅ {form.image.name}</p>}
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl text-[14px] font-bold hover:opacity-90 active:scale-[0.98] transition-all">
                Update Product
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
