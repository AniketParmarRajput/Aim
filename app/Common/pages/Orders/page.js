"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useRouter } from "next/navigation";

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const EditModal = ({ order, isAdmin, onClose, onSave }) => {
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
    const res = await fetch(`http://localhost:5000/api/order/cancel/${order.id}`, {
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOrder, setEditOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");

  const isAdmin = user?.role === "admin";

  const fetchOrders = async () => {
    try {
      if (!user) return;
      if (isAdmin) {
        const res = await fetch("http://localhost:5000/api/order/all");
        const result = await res.json();
        if (result.success) setOrders(result.data);
      } else if (user.email) {
        const res = await fetch(`http://localhost:5000/api/order/by-email/${user.email}`);
        const result = await res.json();
        if (result.success) setOrders(result.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const filteredOrders = isAdmin && searchEmail
    ? orders.filter((o) => o.email?.toLowerCase().includes(searchEmail.toLowerCase()))
    : orders;

  const canCancel = (status) => isAdmin || ["pending", "confirmed"].includes(status);

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-brand-dark">{isAdmin ? "All Orders" : "My Orders"}</h1>
            <p className="text-xs text-gray-400 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => router.push("/Common/pages/Products")} className="text-xs font-medium text-brand-orange border border-brand-orange px-4 py-2 rounded-lg hover:bg-brand-orange hover:text-white transition-all">
            Continue Shopping
          </button>
        </div>

        {isAdmin && orders.length > 0 && (
          <div className="mb-4">
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by customer email..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-brand-light focus:outline-none focus:border-brand-orange transition-all"
            />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 animate-fade-in">
            <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-5xl mb-3">📦</p>
            <p className="text-sm font-medium text-gray-400">
              {searchEmail ? "No orders match your search" : "No orders yet"}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {searchEmail ? "Try a different email" : "Place your first order to see it here"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredOrders.map((order, i) => (
              <div key={order.id} className="bg-brand-light border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-brand-dark">{order.itemName}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {isAdmin && <><span className="font-medium text-gray-600">{order.email}</span> &middot; </>}
                      SKU: {order.sku} &middot; #{order.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isAdmin && (
                      <button onClick={() => setEditOrder(order)} className="text-[11px] text-brand-orange border border-brand-orange px-2.5 py-1 rounded-lg hover:bg-brand-orange hover:text-white transition-all">
                        Edit
                      </button>
                    )}
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusColors[order.status] || "bg-brand-cream text-gray-600 border-gray-200"}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400">Price</p>
                    <p className="font-semibold text-gray-900">₹{Number(order.price).toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Qty</p>
                    <p className="font-semibold text-gray-900">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Payment</p>
                    <p className="font-semibold text-gray-900 capitalize">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Delivery</p>
                    <p className="font-semibold text-gray-900">{order.deliveryDate}</p>
                  </div>
                </div>
                {(order.address || order.mobile) && (
                  <div className="mt-2 grid grid-cols-2 gap-3 text-[11px] text-gray-500 bg-brand-cream rounded-lg px-3 py-2">
                    {order.mobile && <div><span className="text-gray-400">Mobile:</span> {order.mobile}</div>}
                    {order.address && <div className="col-span-2"><span className="text-gray-400">Address:</span> {order.address}</div>}
                  </div>
                )}
                {order.cancelReason && (
                  <div className="mt-2 text-[11px] text-red-500 bg-red-50 rounded-lg px-3 py-1.5">
                    Cancelled: {order.cancelReason}
                  </div>
                )}
                {canCancel(order.status) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => setCancelOrder(order)} className="text-[11px] text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {editOrder && <EditModal order={editOrder} isAdmin={isAdmin} onClose={() => setEditOrder(null)} onSave={(updated) => setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o))} />}
      {cancelOrder && <CancelModal order={cancelOrder} onClose={() => setCancelOrder(null)} onSave={(updated) => setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o))} />}
    </div>
  );
};

export default OrdersPage;
