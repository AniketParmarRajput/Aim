"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../Context/AuthContext";
import PageHero from "@/app/Components/Reusable/PageHero";

const CATEGORIES = ["Men", "Women", "Childs", "Other"];

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    itemName: "",
    amount: "",
    description: "",
    category: "Men",
    discount: "",
    badge: "none",
    colour: "",
    stock: "",
    image: null,
  });

  const skuPreview = form.itemName && form.category
    ? (form.itemName.charAt(0).toUpperCase() + form.category.charAt(0).toUpperCase()) + String(products.length + 1).padStart(3, "0")
    : "";

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing`);
      const result = await res.json();
      setProducts(result.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-md">
          <span className="text-6xl">🚫</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Access Denied</h1>
          <p className="text-sm text-gray-400 mt-2">Only admin users can manage products.</p>
          <button onClick={() => router.push("/Common/pages/home")} className="mt-6 bg-brand-orange text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-hover transition-all">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const openAdd = () => setShowAdd(true);
  const closeAdd = () => {
    setShowAdd(false);
    setForm({ itemName: "", amount: "", description: "", category: "Men", discount: "", badge: "none", colour: "", stock: "", image: null });
  };

  const handleAddSubmit = async (e) => {
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
    if (skuPreview) fd.append("sku", skuPreview);
    if (form.image) fd.append("image", form.image);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/addPrizing`, { method: "POST", body: fd });
    closeAdd();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <PageHero
        badge="🏷️ Product Pricing"
        title="Add & Manage Your"
        titleGradient="Products"
        subtitle="Create, update, and organize your product catalog with prices, discounts, stock, and more."
        showExplore={false}
        features={[
          { icon: "➕", title: "Add Products", sub: "Easy creation" },
          { icon: "✏️", title: "Edit Details", sub: "Update anytime" },
          { icon: "📦", title: "Stock Control", sub: "Track inventory" },
          { icon: "🏷️", title: "Discounts", sub: "Set offers" },
        ]}
      />
      <div className="px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-md">
              <span className="text-white text-lg">📋</span>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900">All Products</h1>
              <p className="text-[12px] text-gray-400">{products.length} items</p>
            </div>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-brand-dark text-white text-[13px] font-medium px-4 py-2.5 rounded-xl hover:opacity-90 transition-all">
            <span className="text-lg">+</span> Add Product
          </button>
        </div>

        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-cream border-b border-gray-200 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Badge</th>
                  <th className="px-4 py-3">Colour</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-12 text-gray-400 animate-fade-in"><p className="text-3xl mb-2">📭</p><p className="text-sm">No products yet.</p></td></tr>
                ) : products.map((p, i) => {
                  const discAmount = Number(p.discount) > 0
                    ? Math.round(Number(p.amount) * (1 - Number(p.discount) / 100))
                    : Number(p.amount);
                  const stockLow = Number(p.stock) > 0 && Number(p.stock) <= 5;
                  const outOfStock = Number(p.stock) === 0;
                  return (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-brand-cream transition-colors text-[13px] animate-fade-in" style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}>
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-muted flex items-center justify-center overflow-hidden">
                          {p.image ? (
                            <img src={(() => { const u = Array.isArray(p.image) ? p.image[0] : p.image; return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; })()} alt="" className={`w-full h-full object-cover ${Number(p.stock) === 0 ? "grayscale opacity-70" : ""}`} />
                          ) : (
                            <span className="text-sm">📦</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[12px] text-brand-dark font-semibold">{p.sku || <span className="text-gray-300">-</span>}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.itemName}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-900">₹{discAmount.toLocaleString("en-IN")}</span>
                        {Number(p.discount) > 0 && (
                          <span className="text-[11px] text-gray-400 line-through ml-1.5">₹{Number(p.amount).toLocaleString("en-IN")}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{Number(p.discount) > 0 ? <span className="text-orange-600 font-medium">{p.discount}%</span> : <span className="text-gray-300">-</span>}</td>
                      <td className="px-4 py-3">
                        {outOfStock ? (
                          <span className="text-red-500 font-medium">Out of Stock</span>
                        ) : (
                          <span className={stockLow ? "text-orange-500 font-medium" : "text-gray-700"}>{p.stock ?? 0}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {p.badge && p.badge !== "none" ? (
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            p.badge === "new" ? "bg-pink-50 text-pink-700" :
                            p.badge === "sale" ? "bg-orange-50 text-orange-700" :
                            p.badge === "out of stock" ? "bg-brand-muted text-gray-500" :
                            p.badge === "limited stock" ? "bg-yellow-50 text-yellow-700" :
                            "bg-sky-50 text-sky-700"
                          }`}>{p.badge === "out of stock" ? "Out of Stock" : p.badge === "limited stock" ? `Limited Stock - ${p.stock ?? 0}` : p.badge}</span>
                        ) : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-4 py-3">
                        {p.colour ? (
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: p.colour }} />
                            <span className="text-[11px] text-gray-500 font-mono">{p.colour}</span>
                          </div>
                        ) : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={async () => { await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/toggleActive/${p.id}`, { method: "PATCH" }); fetchProducts(); }} className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-300 ${p.active ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" : "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"}`}>
                          {p.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => router.push(`/Common/pages/Pricing/edit/${p.id}`)} className="text-[12px] font-medium text-brand-orange hover:text-brand-orange-hover border border-brand-orange px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors">
                            Edit
                          </button>
                          <button onClick={async () => { if (confirm("Delete this product?")) { await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/deletePrizing/${p.id}`, { method: "DELETE" }); fetchProducts(); } }} className="text-[12px] font-medium text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={closeAdd}>
          <div className="bg-brand-light rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-dark flex items-center justify-center">
                  <span className="text-white text-base">🏷️</span>
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-gray-900">Add Product</h2>
                  <p className="text-[11px] text-gray-400">Fill in the details to add a new item</p>
                </div>
              </div>
              <button onClick={closeAdd} className="w-8 h-8 rounded-full bg-brand-muted hover:bg-brand-muted flex items-center justify-center text-gray-500 text-lg transition-colors">✕</button>
            </div>
            <div className="p-6 pt-4">
              <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Item Name</label>
                  <input type="text" value={form.itemName} placeholder="Enter item name" required onChange={(e) => setForm({ ...form, itemName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" value={form.amount} placeholder="Enter price" required onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} placeholder="Enter a short description..." rows={2} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Discount %</label>
                  <input type="number" value={form.discount} placeholder="%" onChange={(e) => setForm({ ...form, discount: e.target.value })} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Badge</label>
                  <select value={form.badge} onChange={(e) => {
                    const val = e.target.value;
                    if (val === "out of stock") setForm({ ...form, badge: val, stock: "0" });
                    else if (val === "limited stock") setForm({ ...form, badge: val, stock: form.stock || "1" });
                    else setForm({ ...form, badge: val });
                  }} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all">
                    <option value="none">None</option>
                    <option value="new">New</option>
                    <option value="sale">Sale</option>
                    <option value="limited stock">Limited Stock</option>
                    <option value="out of stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">SKU Code</label>
                  <div className="flex items-center gap-2 bg-brand-cream border border-gray-200 rounded-xl px-3 py-2">
                    <span className="text-[13px] font-mono font-bold text-brand-dark">{skuPreview || <span className="text-gray-300 font-normal">Auto-generated</span>}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Colour</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.colour || "#000000"} onChange={(e) => setForm({ ...form, colour: e.target.value })} className="w-10 h-10 rounded-xl border border-gray-200 bg-brand-cream cursor-pointer p-0.5" />
                    <input type="text" value={form.colour} placeholder="#000000" onChange={(e) => setForm({ ...form, colour: e.target.value })} className="flex-1 px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Stock Limit</label>
                  <input type="number" value={form.stock} placeholder="0" onChange={(e) => {
                    const s = Number(e.target.value);
                    setForm({ ...form, stock: e.target.value, badge: s === 0 && form.badge !== "out of stock" ? "out of stock" : s > 0 && s <= 5 && form.badge !== "limited stock" ? "limited stock" : s > 5 && (form.badge === "limited stock" || form.badge === "out of stock") ? "none" : form.badge });
                  }} required={form.badge === "limited stock" || form.badge === "out of stock"} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Image</label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl px-4 py-3 bg-brand-cream hover:border-brand-orange hover:bg-orange-50/30 transition-all cursor-pointer text-center group">
                    <span className="text-xl mb-0.5">🖼️</span>
                    <span className="text-[12px] text-gray-500 font-medium"><span className="text-brand-orange font-semibold group-hover:underline">Click to upload</span></span>
                    <input type="file" className="hidden" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} required />
                  </label>
                  {form.image && <p className="text-[11px] text-brand-orange font-medium mt-1">✅ {form.image.name}</p>}
                </div>
                <div className="md:col-span-2 flex gap-3 mt-2">
                  <button type="submit" className="flex-1 py-2 bg-brand-dark text-white rounded-xl text-[13px] font-bold hover:opacity-90 transition-all">
                    + Add Product
                  </button>
                  <button type="button" onClick={closeAdd} className="py-2 px-5 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-medium hover:bg-brand-cream transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
