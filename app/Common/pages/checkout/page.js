"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "@/app/Common/Context/AuthContext";
import { useCart } from "@/app/Common/Context/CartContext";



export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { items, clearCart, updateQuantity } = useCart();

  const productId = searchParams.get("productId") || null;
  const [qty, setQty] = useState(Number(searchParams.get("quantity")) || 1);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const addDays = (date, n) => {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  };
  const minDeliveryDate = formatDate(addDays(new Date(), 7));
  const prettyDate = (d) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ mobile: "", address: "", state: "", district: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState("cash on delivery");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(minDeliveryDate);

  useEffect(() => {
    if (productId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing/${productId}`)
        .then((r) => r.json())
        .then((res) => setProduct(res.data || res))
        .catch(() => {});
    }
  }, [productId]);

  const isFromCart = !productId;
  const orderItems = isFromCart ? items : (product ? [{ ...product, quantity: qty }] : []);
  const finalPrice = (item) => {
    const amount = Number(item.amount || item.price || 0);
    const discount = Number(item.discount || 0);
    const q = isFromCart ? item.quantity : qty;
    return discount > 0 ? Math.round(amount - (amount * discount) / 100) * q : amount * q;
  };
  const totalAmount = orderItems.reduce((sum, item) => sum + finalPrice(item), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.email) {
      router.push("/Common/pages/login");
      return;
    }
    if (!form.mobile || !form.address || !form.state || !form.district || !form.pincode) {
      setError("Please fill in all fields");
      return;
    }

    setShowDateModal(true);
  };

  const placeOrder = async () => {
    if (!deliveryDate) {
      setError("Please select a delivery date");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const stockCheck = orderItems.map((item) => {
        const q = isFromCart ? item.quantity : qty;
        if (item.stock !== undefined && item.stock < q) {
          return `Insufficient stock for "${item.itemName}". Available: ${item.stock}, requested: ${q}`;
        }
        return null;
      }).filter(Boolean);

      if (stockCheck.length > 0) {
        setError(stockCheck.join(". "));
        setLoading(false);
        return;
      }

      const promises = orderItems.map((item) => {
        const amount = Number(item.amount || item.price || 0);
        const discount = Number(item.discount || 0);
        const q = isFromCart ? item.quantity : qty;
        const price = discount > 0 ? Math.round(amount - (amount * discount) / 100) * q : amount * q;

        const itemImage = Array.isArray(item.image) ? item.image[0] : item.image;

        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            itemName: item.itemName,
            sku: item.sku,
            price,
            quantity: q,
            productId: item.id,
            image: itemImage || null,
            paymentMethod,
            deliveryDate,
            address: form.address,
            mobile: form.mobile,
            state: form.state,
            district: form.district,
            pincode: form.pincode,
          }),
        }).then((r) => r.json());
      });

      const results = await Promise.all(promises);
      const allOk = results.every((r) => r.success);

      if (allOk) {
        setSuccess(true);
        if (isFromCart) clearCart();
        setTimeout(() => router.push("/Common/pages/Orders"), 2500);
      } else {
        setError(results.find((r) => !r.success)?.message || "Failed to place order");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="bg-brand-light rounded-3xl shadow-2xl p-8 text-center max-w-sm mx-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Order Placed!</h2>
          <p className="text-sm text-gray-400">Your order will be delivered on {prettyDate(deliveryDate)}.</p>
          <p className="text-xs text-gray-300 mt-3 animate-pulse">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all";
  const labelClass = "block text-[12.5px] font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-orange hover:text-brand-orange transition-all"><ArrowLeftIcon size={16} /></button>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-6">
            <h2 className="text-[15px] font-bold text-gray-900 mb-5">Delivery Details</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Mobile Number</label>
                <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="+1 234 567 890" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} placeholder="Full address, street, building..." rows={3} className={`${inputClass} resize-none`} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>State</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>District</label>
                  <input type="text" name="district" value={form.district} onChange={handleChange} placeholder="District" className={inputClass} required />
                </div>
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input type="text" name="pincode" value={form.pincode} onChange={handleChange} placeholder="123456" className={inputClass} required />
              </div>

              <div>
                <label className={`${labelClass} mb-2`}>Payment Method</label>
                <div className="flex gap-3">
                  <label className={`flex items-center gap-2.5 flex-1 px-4 py-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === "cash on delivery" ? "border-brand-orange bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <input type="radio" name="payment" value="cash on delivery" checked={paymentMethod === "cash on delivery"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-brand-orange" />
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-[10px] text-gray-400">Pay when you receive</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-2.5 flex-1 px-4 py-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === "online" ? "border-brand-orange bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-brand-orange" />
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">Online Payment</p>
                      <p className="text-[10px] text-gray-400">Pay now with card / UPI</p>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                  <span className="text-red-400 text-sm">⚠</span>
                  <p className="text-red-600 text-[12.5px] font-medium">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading || orderItems.length === 0} className="w-full py-2.5 bg-brand-dark text-white rounded-xl text-[14px] font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Placing order..." : `Place Order (${paymentMethod === "cash on delivery" ? "Cash on Delivery" : "Online Payment"}) — ₹${totalAmount.toLocaleString("en-IN")}`}
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-6 h-fit">
            <h3 className="text-[14px] font-bold text-gray-900 mb-4">Order Summary</h3>
            {orderItems.length === 0 ? (
              <p className="text-sm text-gray-400">No items to order.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {orderItems.map((item, idx) => {
                  const amount = Number(item.amount || item.price || 0);
                  const discount = Number(item.discount || 0);
                  const q = isFromCart ? item.quantity : qty;
                  const itemTotal = discount > 0 ? Math.round(amount - (amount * discount) / 100) * q : amount * q;
                  return (
                    <div key={item.id || idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-cream flex items-center justify-center text-lg overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={(() => { const u = Array.isArray(item.image) ? item.image[0] : item.image; return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; })()} alt={item.itemName} onClick={() => item.id && router.push(`/Common/pages/Products/${item.id}`)} className={`w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300 ${Number(item.stock) === 0 ? "grayscale opacity-70" : ""}`} />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{item.itemName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isFromCart) updateQuantity(item.id, -1);
                              else setQty((prev) => Math.max(1, prev - 1));
                            }}
                            disabled={q <= 1}
                            className="w-6 h-6 rounded-md border border-gray-200 bg-white hover:bg-brand-orange hover:text-white text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="text-[12px] font-semibold text-gray-900 w-5 text-center">Qty: {q}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (isFromCart) updateQuantity(item.id, 1);
                              else setQty((prev) => prev + 1);
                            }}
                            disabled={Number(item.stock) > 0 && q >= Number(item.stock)}
                            className="w-6 h-6 rounded-md border border-gray-200 bg-white hover:bg-brand-orange hover:text-white text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-[13px] font-semibold text-brand-dark">₹{itemTotal.toLocaleString("en-IN")}</p>
                    </div>
                  );
                })}
              </div>
            )}
            <hr className="border-gray-100 mb-3" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-brand-orange">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {showDateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowDateModal(false)}>
            <div className="bg-brand-light rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-gray-900">Select Delivery Date</h2>
                <button onClick={() => setShowDateModal(false)} className="w-8 h-8 rounded-full bg-brand-muted flex items-center justify-center text-gray-500 transition-colors">✕</button>
              </div>
              <p className="text-[12.5px] text-gray-400 mb-4">
                Orders are delivered a minimum of <span className="font-semibold text-brand-orange">7 days</span> after placing. Pick your preferred delivery date.
              </p>
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  min={minDeliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all"
                />
              </div>
              {deliveryDate && (
                <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-[12.5px] text-gray-600">Estimated delivery date</p>
                  <p className="text-[15px] font-bold text-brand-dark mt-0.5">{prettyDate(deliveryDate)}</p>
                </div>
              )}
              {error && (
                <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                  <span className="text-red-400 text-sm">⚠</span>
                  <p className="text-red-600 text-[12.5px] font-medium">{error}</p>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button onClick={placeOrder} disabled={loading} className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl text-[13px] font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? "Placing order..." : `Confirm & Place Order — ₹${totalAmount.toLocaleString("en-IN")}`}
                </button>
                <button onClick={() => setShowDateModal(false)} className="py-2.5 px-5 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-medium hover:bg-brand-cream transition-all">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
