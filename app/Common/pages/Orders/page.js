"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useRouter } from "next/navigation";
import { downloadOrderBill } from "./bill";

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_ICONS = {
  pending: "📥",
  confirmed: "✅",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "📦",
  cancelled: "❌",
};

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const PLUS_THRESHOLD = 20;

const getImg = (img) => Array.isArray(img) ? img[0] : img;

const MembershipCard = ({ completed }) => {
  const isMember = completed >= PLUS_THRESHOLD;
  const pct = Math.min(100, Math.round((completed / PLUS_THRESHOLD) * 100));

  return (
    <div className="mb-4 relative overflow-hidden rounded-2xl p-5 text-white shadow-lg bg-linear-to-br from-brand-tan to-brand-orange">
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute right-10 -bottom-8 w-24 h-24 rounded-full bg-white/10" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${isMember ? "bg-green-500/30" : "bg-white/20"}`}>
            {isMember ? "👑" : "⭐"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold">{isMember ? "easyShop Plus Member" : `easyShop Plus · ${completed}/${PLUS_THRESHOLD} orders to unlock`}</p>
            <p className="text-[11px] text-white/80 mt-0.5">
              {isMember
                ? "👑 You've earned FREE delivery on every order. Enjoy!"
                : "Complete 20 orders to unlock easyShop Plus with FREE delivery."}
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-2xl font-bold leading-none">{completed}</p>
          <p className="text-[11px] text-white/80 mt-0.5">completed</p>
        </div>
      </div>

      {!isMember && (
        <div className="relative mt-3.5">
          <div className="h-2 rounded-full bg-white/25 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[10px] text-white/80">
            <span>{pct}% complete</span>
            <span>{Math.max(0, PLUS_THRESHOLD - completed)} more to go 🎯</span>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusProgress = ({ status }) => {
  if (status === "cancelled") return null;
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-3.5 h-0.5 bg-gray-200 translate-y-[-50%]" />
        <div
          className="absolute left-0 top-3.5 h-0.5 bg-brand-orange translate-y-[-50%] transition-all duration-500"
          style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
        />
        {STATUS_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          return (
            <div key={step} className="relative flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] z-10 transition-all ${done ? "bg-brand-orange text-white shadow" : "bg-white border-2 border-gray-300 text-gray-400"}`}>
                {done ? "✓" : STATUS_ICONS[step]}
              </div>
              <span className={`text-[9px] mt-1 hidden sm:block ${done ? "text-brand-dark font-medium" : "text-gray-400"}`}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EditModal = ({ order, isAdmin, onClose, onSave }) => {
  const unitPrice = Math.round(Number(order.price) / Number(order.quantity));
  const [quantity, setQuantity] = useState(order.quantity);
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate);
  const [status, setStatus] = useState(order.status);
  const [address, setAddress] = useState(order.address || "");
  const [mobile, setMobile] = useState(order.mobile || "");
  const [state, setState] = useState(order.state || "");
  const [district, setDistrict] = useState(order.district || "");
  const [pincode, setPincode] = useState(order.pincode || "");
  const newTotal = unitPrice * Number(quantity);

  const handleSave = async () => {
    const body = { quantity: Number(quantity), deliveryDate, address, mobile, state, district, pincode, status };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/update/${order.id}`, {
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
          <h2 className="text-[17px] font-bold text-gray-900">Edit Order</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-brand-muted hover:bg-brand-muted flex items-center justify-center text-gray-500 transition-colors">✕</button>
        </div>
        {isAdmin && order.email && (
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
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">State</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">District</label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Pincode</label>
            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
          </div>
          {isAdmin && (
            <div>
              <label className="block text-[12px] font-semibold text-gray-700 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl text-[13px] font-bold hover:opacity-90 transition-all">Save</button>
            <button onClick={onClose} className="py-2.5 px-5 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-medium hover:bg-brand-cream transition-all">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CancelModal = ({ order, onClose, onSave }) => {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const reasons = [
    "Change of mind",
    "Found better price",
    "Delivery takes too long",
    "Ordered by mistake",
    "Product not needed",
  ];

  const handleCancel = async () => {
    const finalReason = reason === "Other" ? otherReason : reason;
    if (!finalReason) return alert("Please select or enter a reason");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/cancel/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: finalReason }),
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
          <h2 className="text-[17px] font-bold text-gray-900">Cancel Order</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-brand-muted hover:bg-brand-muted flex items-center justify-center text-gray-500 transition-colors">✕</button>
        </div>
        <p className="text-[13px] text-gray-500 mb-3">Why do you want to cancel <span className="font-semibold text-gray-900">{order.itemName}</span>?</p>
        <div className="space-y-2">
          {reasons.map((r) => (
            <label key={r} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${reason === r ? "border-brand-orange bg-orange-50 text-brand-orange" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="reason" value={r} checked={reason === r} onChange={(e) => setReason(e.target.value)} className="accent-brand-orange" />
              <span className="text-[13px] font-medium">{r}</span>
            </label>
          ))}
          <label className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${reason === "Other" ? "border-brand-orange bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
            <input type="radio" name="reason" value="Other" checked={reason === "Other"} onChange={(e) => setReason(e.target.value)} className="accent-brand-orange" />
            <span className="text-[13px] font-medium">Other</span>
          </label>
          {reason === "Other" && (
            <textarea value={otherReason} onChange={(e) => setOtherReason(e.target.value)} placeholder="Enter your reason..." rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all resize-none" />
          )}
        </div>
        <div className="flex gap-3 pt-4">
          <button onClick={handleCancel} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-[13px] font-bold hover:bg-red-600 transition-all">Confirm Cancel</button>
          <button onClick={onClose} className="py-2.5 px-5 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-medium hover:bg-brand-cream transition-all">Keep Order</button>
        </div>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [editOrder, setEditOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const isAdmin = user?.role === "admin";

  const getOrderImage = (order) => {
    if (order.image) {
      const u = Array.isArray(order.image) ? order.image[0] : order.image;
      return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`;
    }
    const product = productsMap[order.productId];
    if (product?.image) {
      const u = getImg(product.image);
      return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`;
    }
    return null;
  };

  const fetchOrders = async () => {
    try {
      if (!user) return;
      const [prodRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing`),
      ]);
      const prodResult = await prodRes.json();
      const allProducts = prodResult.data || [];
      const map = {};
      allProducts.forEach((p) => { map[p.id] = p; });
      setProductsMap(map);

      if (isAdmin) {
        const [ordersRes, usersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/all`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get`),
        ]);
        const ordersResult = await ordersRes.json();
        const usersResult = await usersRes.json();
        const umap = {};
        (usersResult.data || []).forEach((u) => { if (u.id) umap[u.id] = u; });
        setUserMap(umap);
        if (ordersResult.success) setOrders(ordersResult.data);
      } else if (user.id) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/user/${user.id}`);
        const result = await res.json();
        if (result.success) setOrders(result.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const getCustomer = (o) => (o.userId ? userMap[o.userId] : null);
  const filteredOrders = (() => {
    if (isAdmin && searchEmail) {
      return orders.filter((o) => {
        const u = getCustomer(o);
        const em = u?.email || o.email || "";
        return em.toLowerCase().includes(searchEmail.toLowerCase());
      });
    }
    if (!isAdmin && searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      return orders.filter((o) =>
        (o.itemName || "").toLowerCase().includes(q) ||
        (o.sku || "").toLowerCase().includes(q) ||
        (o.status || "").toLowerCase().includes(q) ||
        (o.paymentMethod || "").toLowerCase().includes(q)
      );
    }
    return orders;
  })();

  const activeOrders = orders.filter((o) => o.status !== "cancelled" && o.status !== "delivered").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const completedCount = orders.filter((o) => o.status === "delivered").length;

  const canCancel = (status) => isAdmin || ["pending", "confirmed"].includes(status);

  const handleDownloadBill = async (order) => {
    try {
      let customerName = "";
      if (order.userId) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get/${order.userId}`);
        const result = await res.json();
        if (result.success && result.data?.name) customerName = result.data.name;
      }
      await downloadOrderBill(order, customerName);
    } catch (err) {
      console.error("Error downloading bill:", err);
      alert("Could not download the bill. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-brand-dark text-white p-6 mb-6 shadow-lg">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-brand-orange/20" />
          <div className="absolute right-16 -bottom-10 w-32 h-32 rounded-full bg-brand-tan/20" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">📦</div>
              <div>
                <h1 className="text-lg font-bold">{mounted ? (isAdmin ? "All Orders" : "My Orders") : "Orders"}</h1>
                <p className="text-xs text-white/60">{orders.length} order{orders.length !== 1 ? "s" : ""} · {isAdmin ? "full order management" : "track & manage your purchases"}</p>
              </div>
            </div>
            <button onClick={() => router.push("/Common/pages/Products")} className="shrink-0 w-full sm:w-auto text-xs font-medium bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow">
              🛍️ Continue Shopping
            </button>
          </div>
        </div>

        {/* Stats row */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatCard icon="📥" label={isAdmin ? "Active" : "In Progress"} value={activeOrders} />
            <StatCard icon="✅" label="Delivered" value={deliveredOrders} />
            <StatCard icon="❌" label="Cancelled" value={cancelledOrders} />
          </div>
        )}

        {/* easyShop Plus membership */}
        {!isAdmin && !loading && <MembershipCard completed={completedCount} />}

        {/* Search */}
        {orders.length > 0 && (
          <div className="mb-4 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={isAdmin ? searchEmail : searchTerm}
              onChange={(e) => isAdmin ? setSearchEmail(e.target.value) : setSearchTerm(e.target.value)}
              placeholder={isAdmin ? "Search by customer email..." : "Search by product, status, payment..."}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all"
            />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 animate-fade-in">
            <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-brand-light border border-gray-100 rounded-2xl text-center py-16 px-4 animate-fade-in">
            <p className="text-5xl mb-3">📦</p>
            <p className="text-sm font-semibold text-gray-600">
              {searchEmail || searchTerm ? "No orders match your search" : "No orders yet"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {searchEmail || searchTerm ? "Try a different keyword" : "Place your first order to see it here"}
            </p>
            {!(searchEmail || searchTerm) && (
              <button onClick={() => router.push("/Common/pages/Products")} className="mt-5 text-sm font-medium text-white bg-brand-orange hover:bg-brand-orange-hover px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredOrders.map((order, i) => {
              const orderImg = getOrderImage(order);
              return (
              <div key={order.id} className="bg-brand-light border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-gray-200 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}>
                <div className="flex items-start gap-3">
                  <div className={`w-14 h-14 rounded-xl bg-brand-muted flex items-center justify-center overflow-hidden shrink-0 ${order.status === "cancelled" ? "opacity-60 grayscale" : ""}`}>
                    {orderImg ? (
                      <img src={orderImg} alt={order.itemName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">📦</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-brand-dark truncate">{order.itemName}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {isAdmin && <><span className="font-medium text-gray-600">{getCustomer(order)?.email || order.email}</span> &middot; </>}
                          SKU: {order.sku} &middot; #{order.id}
                        </p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1.5 rounded-full border ${statusColors[order.status] || "bg-brand-cream text-gray-600 border-gray-200"}`}>
                        {STATUS_ICONS[order.status] || ""} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                      {isAdmin && (
                        <button onClick={() => setEditOrder(order)} className="text-[11px] text-brand-orange border border-brand-orange px-2.5 py-1.5 rounded-lg hover:bg-brand-orange hover:text-white transition-all">
                          Edit
                        </button>
                      )}
                      <button onClick={() => handleDownloadBill(order)} className="text-[11px] text-green-700 border border-green-600 px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-600 hover:text-white transition-all">
                        🧾 Bill
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100 text-xs">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[11px]">Order Total</span>
                    <span className="font-bold text-brand-dark mt-0.5">₹{Number(order.price).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[11px]">Quantity</span>
                    <span className="font-semibold text-gray-900 mt-0.5">{order.quantity} item{order.quantity !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[11px]">Payment</span>
                    <span className="font-semibold text-gray-900 capitalize mt-0.5">{order.paymentMethod}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[11px]">Delivery</span>
                    <span className="font-semibold text-gray-900 mt-0.5 flex items-center gap-1">🚚 {order.deliveryDate}</span>
                  </div>
                </div>
                {(order.address || order.mobile || order.state || order.district || order.pincode) && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-500 bg-brand-cream rounded-lg px-3 py-2">
                    {order.mobile && <div><span className="text-gray-400">Mobile:</span> {order.mobile}</div>}
                    {order.address && <div className="col-span-2 sm:col-span-3"><span className="text-gray-400">Address:</span> {order.address}</div>}
                    {order.state && <div><span className="text-gray-400">State:</span> {order.state}</div>}
                    {order.district && <div><span className="text-gray-400">District:</span> {order.district}</div>}
                    {order.pincode && <div><span className="text-gray-400">Pincode:</span> {order.pincode}</div>}
                  </div>
                )}
                {order.cancelReason && (
                  <div className="mt-2 text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-1.5">
                    Cancelled: {order.cancelReason}
                  </div>
                )}
                {!isAdmin && order.status !== "cancelled" && (
                  <StatusProgress status={order.status} />
                )}
                {canCancel(order.status) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => setCancelOrder(order)} className="text-[11px] text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>

      {editOrder && <EditModal order={editOrder} isAdmin={isAdmin} onClose={() => setEditOrder(null)} onSave={(updated) => setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o))} />}
      {cancelOrder && <CancelModal order={cancelOrder} onClose={() => setCancelOrder(null)} onSave={(updated) => setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o))} />}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-brand-light border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
    <div className="w-9 h-9 rounded-lg bg-brand-muted flex items-center justify-center text-base shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-lg font-bold text-brand-dark leading-none">{value}</p>
      <p className="text-[11px] text-gray-400 mt-1">{label}</p>
    </div>
  </div>
);

export default OrdersPage;