"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../Context/AuthContext";

const CATEGORIES = ["Men", "Women", "Childs", "Other"];
const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "products", label: "Products", icon: "🏷️" },
  { key: "orders", label: "Orders", icon: "📦" },
];

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const EditOrderModal = ({ order, onClose, onSave }) => {
  const unitPrice = Math.round(Number(order.price) / Number(order.quantity));
  const [quantity, setQuantity] = useState(order.quantity);
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate);
  const [status, setStatus] = useState(order.status);
  const [address, setAddress] = useState(order.address || "");
  const [mobile, setMobile] = useState(order.mobile || "");
  const newTotal = unitPrice * Number(quantity);

  const handleSave = async () => {
    const body = { quantity: Number(quantity), deliveryDate, address, mobile, status };
    const res = await fetch(`http://localhost:5000/api/order/update/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    if (result.success) {
      onSave(result.data);
      onClose();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-brand-light rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-gray-900">Edit Order #{order.id}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-brand-muted hover:bg-brand-muted flex items-center justify-center text-gray-500 transition-colors">✕</button>
        </div>
        {order.email && (
          <p className="text-[12px] text-gray-400 mb-3">Customer: <span className="font-medium text-gray-700">{order.email}</span></p>
        )}
        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-center">
            <span className="text-[12px] text-gray-500">Unit Price: </span>
            <span className="text-[13px] font-bold text-brand-dark">₹{unitPrice.toLocaleString("en-IN")}</span>
            <span className="mx-2 text-gray-300">×</span>
            <span className="text-[12px] text-gray-500">Qty: </span>
            <span className="text-[13px] font-bold text-brand-dark">{quantity}</span>
            <span className="mx-2 text-gray-300">=</span>
            <span className="text-[14px] font-bold text-brand-orange">₹{newTotal.toLocaleString("en-IN")}</span>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Quantity</label>
            <input type="number" value={quantity} min={1} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Delivery Date</label>
            <input type="text" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" placeholder="e.g. 7 days" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Mobile</label>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter mobile number" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter delivery address" rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all resize-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl text-[13px] font-bold hover:opacity-90 transition-all">Save</button>
            <button onClick={onClose} className="py-2.5 px-5 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-medium hover:bg-brand-cream transition-all">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState({ itemName: "", amount: "", description: "", category: "Men", discount: "", badge: "none", colour: "", stock: "", image: null });

  const isAdmin = user?.role === "admin";

  const skuPreview = form.itemName && form.category
    ? (form.itemName.charAt(0).toUpperCase() + form.category.charAt(0).toUpperCase()) + String(products.length + 1).padStart(3, "0")
    : "";

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/prizing/getPrizing");
      const result = await res.json();
      setProducts(result.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/order/all");
      const result = await res.json();
      if (result.success) setOrders(result.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!user) return;
    if (!isAdmin) return;
    setLoading(true);
    Promise.all([fetchProducts(), fetchOrders()]).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-md">
          <span className="text-6xl">🚫</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Access Denied</h1>
          <p className="text-sm text-gray-400 mt-2">You do not have admin privileges to access this panel.</p>
          <button onClick={() => router.push("/Common/pages/home")} className="mt-6 bg-brand-orange text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-hover transition-all">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.price || 0) * Number(o.quantity || 1), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const filteredOrders = statusFilter === "All" ? orders : orders.filter((o) => o.status === statusFilter);

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
    await fetch("http://localhost:5000/api/prizing/addPrizing", { method: "POST", body: fd });
    closeAdd();
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shadow-md">
              <span className="text-white text-lg">⚙️</span>
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-gray-900">Admin Panel</h1>
              <p className="text-[12px] text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shrink-0 ${tab === t.key ? "bg-brand-dark text-white shadow-md" : "bg-brand-light text-gray-600 border border-gray-200 hover:border-brand-orange hover:text-brand-orange"}`}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading admin panel...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {tab === "dashboard" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Products", value: products.length, icon: "🏷️", color: "from-blue-500 to-blue-600" },
                    { label: "Total Orders", value: orders.length, icon: "📦", color: "from-green-500 to-green-600" },
                    { label: "Pending Orders", value: pendingOrders, icon: "⏳", color: "from-yellow-500 to-yellow-600" },
                    { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰", color: "from-brand-orange to-orange-500" },
                  ].map((s) => (
                    <div key={s.label} className="bg-brand-light border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{s.icon}</span>
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center opacity-20`} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Recent Orders */}
                  <div className="bg-brand-light border border-gray-100 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Orders</h3>
                    {orders.length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center">No orders yet</p>
                    ) : (
                      <div className="space-y-2">
                        {orders.slice(0, 5).map((o) => (
                          <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-gray-900 truncate">{o.itemName}</p>
                              <p className="text-[11px] text-gray-400">{o.email}</p>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${statusColors[o.status] || "bg-brand-cream text-gray-600 border-gray-200"}`}>
                              {o.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Low Stock Products */}
                  <div className="bg-brand-light border border-gray-100 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Low Stock Products</h3>
                    {products.filter((p) => Number(p.stock) <= 5).length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center">All products well stocked</p>
                    ) : (
                      <div className="space-y-2">
                        {products.filter((p) => Number(p.stock) <= 5).slice(0, 5).map((p) => (
                          <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-brand-muted flex items-center justify-center overflow-hidden shrink-0">
                                {p.image ? <img src={(() => { const u = Array.isArray(p.image) ? p.image[0] : p.image; return u?.startsWith("http") ? u : `http://localhost:5000/uploads/${u}`; })()} alt="" className="w-full h-full object-cover" /> : <span className="text-xs">📦</span>}
                              </div>
                              <p className="text-[13px] font-medium text-gray-900 truncate">{p.itemName}</p>
                            </div>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${Number(p.stock) === 0 ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}>
                              {Number(p.stock) === 0 ? "Out of Stock" : `${p.stock} left`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {tab === "products" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[12px] text-gray-400">{products.length} products</p>
                  <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-brand-dark text-white text-[13px] font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-all">
                    <span className="text-lg">+</span> Add Product
                  </button>
                </div>

                <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
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
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length === 0 ? (
                          <tr><td colSpan={9} className="text-center py-12 text-gray-400"><p className="text-3xl mb-2">📭</p><p className="text-sm">No products yet.</p></td></tr>
                        ) : products.map((p, i) => {
                          const discAmount = Number(p.discount) > 0 ? Math.round(Number(p.amount) * (1 - Number(p.discount) / 100)) : Number(p.amount);
                          const stockLow = Number(p.stock) > 0 && Number(p.stock) <= 5;
                          const outOfStock = Number(p.stock) === 0;
                          return (
                            <tr key={p.id} className="border-b border-gray-100 hover:bg-brand-cream transition-colors text-[13px] animate-fade-in" style={{ animationDelay: `${i * 0.02}s`, animationFillMode: "both" }}>
                              <td className="px-4 py-3">
                                <div className="w-10 h-10 rounded-lg bg-brand-muted flex items-center justify-center overflow-hidden">
                                  {p.image ? <img src={(() => { const u = Array.isArray(p.image) ? p.image[0] : p.image; return u?.startsWith("http") ? u : `http://localhost:5000/uploads/${u}`; })()} alt="" className="w-full h-full object-cover" /> : <span className="text-sm">📦</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3 font-mono text-[12px] text-brand-dark font-semibold">{p.sku || <span className="text-gray-300">-</span>}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">{p.itemName}</td>
                              <td className="px-4 py-3">
                                <span className="font-semibold text-gray-900">₹{discAmount.toLocaleString("en-IN")}</span>
                                {Number(p.discount) > 0 && <span className="text-[11px] text-gray-400 line-through ml-1.5">₹{Number(p.amount).toLocaleString("en-IN")}</span>}
                              </td>
                              <td className="px-4 py-3">{Number(p.discount) > 0 ? <span className="text-orange-600 font-medium">{p.discount}%</span> : <span className="text-gray-300">-</span>}</td>
                              <td className="px-4 py-3">
                                {outOfStock ? <span className="text-red-500 font-medium">Out of Stock</span> : <span className={stockLow ? "text-orange-500 font-medium" : "text-gray-700"}>{p.stock ?? 0}</span>}
                              </td>
                              <td className="px-4 py-3"><span className="text-gray-600">{p.category || "-"}</span></td>
                              <td className="px-4 py-3">
                                <button onClick={async () => { await fetch(`http://localhost:5000/api/prizing/toggleActive/${p.id}`, { method: "PATCH" }); fetchProducts(); }} className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all duration-300 ${p.active ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" : "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"}`}>
                                  {p.active ? "Active" : "Inactive"}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => router.push(`/Common/pages/Pricing/edit/${p.id}`)} className="text-[12px] font-medium text-brand-orange hover:text-brand-orange-hover border border-brand-orange px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors">Edit</button>
                                  <button onClick={async () => { if (confirm("Delete this product?")) { await fetch(`http://localhost:5000/api/prizing/deletePrizing/${p.id}`, { method: "DELETE" }); fetchProducts(); } }} className="text-[12px] font-medium text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
                            }} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
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
                            <button type="submit" className="flex-1 py-2 bg-brand-dark text-white rounded-xl text-[13px] font-bold hover:opacity-90 transition-all">+ Add Product</button>
                            <button type="button" onClick={closeAdd} className="py-2 px-5 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-medium hover:bg-brand-cream transition-all">Cancel</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {tab === "orders" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[12px] text-gray-400">{orders.length} orders &middot; {new Set(orders.map((o) => o.email).filter(Boolean)).size} customers</p>
                </div>

                <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                  <button onClick={() => setStatusFilter("All")} className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all shrink-0 ${statusFilter === "All" ? "bg-brand-dark text-white" : "bg-brand-light text-gray-600 border border-gray-200 hover:border-brand-orange"}`}>All</button>
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all shrink-0 capitalize ${statusFilter === s ? "bg-brand-dark text-white" : "bg-brand-light text-gray-600 border border-gray-200 hover:border-brand-orange"}`}>
                      {s}
                    </button>
                  ))}
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <p className="text-5xl mb-3">📦</p>
                    <p className="text-sm font-medium">No orders found</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredOrders.map((o, i) => {
                      const totalAmount = Number(o.price) * Number(o.quantity || 1);
                      return (
                      <div key={o.id} className="bg-brand-light border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-brand-dark">{o.itemName}</h3>
                              <span className="text-[10px] text-gray-400">#{o.id}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              <span className="font-medium text-gray-600">{o.email}</span> &middot; SKU: {o.sku}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <button onClick={() => setEditOrder(o)} className="text-[11px] text-brand-orange border border-brand-orange px-2.5 py-1 rounded-lg hover:bg-brand-orange hover:text-white transition-all">
                              Edit
                            </button>
                            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusColors[o.status] || "bg-brand-cream text-gray-600 border-gray-200"}`}>
                              {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                          <div>
                            <p className="text-gray-400">Unit Price</p>
                            <p className="font-semibold text-gray-900">₹{Number(o.price).toLocaleString("en-IN")}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Qty</p>
                            <p className="font-semibold text-gray-900">{o.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Total</p>
                            <p className="font-semibold text-brand-orange">₹{totalAmount.toLocaleString("en-IN")}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Payment</p>
                            <p className="font-semibold text-gray-900 capitalize">{o.paymentMethod || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Delivery</p>
                            <p className="font-semibold text-gray-900">{o.deliveryDate || "N/A"}</p>
                          </div>
                        </div>
                        {(o.address || o.mobile) && (
                          <div className="mt-2 grid grid-cols-2 gap-3 text-[11px] text-gray-500 bg-brand-cream rounded-lg px-3 py-2">
                            {o.mobile && <div><span className="text-gray-400">Mobile:</span> {o.mobile}</div>}
                            {o.address && <div className="col-span-2"><span className="text-gray-400">Address:</span> {o.address}</div>}
                          </div>
                        )}
                        {o.createdAt && (
                          <p className="text-[10px] text-gray-300 mt-2">Ordered on {new Date(o.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        )}
                      </div>
                      );
                    })}
                  </div>
                )}

                {editOrder && <EditOrderModal order={editOrder} onClose={() => setEditOrder(null)} onSave={(updated) => setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o))} />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
