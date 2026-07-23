"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import { useCart } from "@/app/Common/Context/CartContext";
import { useAuth } from "@/app/Common/Context/AuthContext";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash on delivery");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const maxStock = Number(product?.data?.stock) || 999;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/prizing/getPrizing/${id}`
        );
        const result = await response.json();
        setProduct(result);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  const totalPrice = Number(product?.data?.amount || 0) * quantity;
  const discount = Number(product?.data?.discount || 0);
  const discountedPrice = discount > 0
    ? Math.round(totalPrice - (totalPrice * discount) / 100)
    : totalPrice;
  const finalPrice = discount > 0 ? discountedPrice : totalPrice;

  const { addToCart } = useCart();
  const handleAddtoCart = () => {
    addToCart({
      id: product.data?.id,
      itemName: product.data?.itemName,
      amount: product.data?.amount,
      image: product.data?.image,
      discount: product.data?.discount,
      quantity,
    });
  };

  const saveOrder = async () => {
    if (!user?.email) {
      alert("Please login to place an order");
      router.push("/Common/pages/login");
      return false;
    }
    try {
      const res = await fetch("http://localhost:5000/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          itemName: product.data?.itemName,
          sku: product.data?.sku,
          price: finalPrice,
          quantity,
          paymentMethod,
          productId: product.data?.id,
          address: address || null,
          mobile: mobile || null,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setOrderPlaced(true);
        setShowPayment(false);
        return true;
      } else {
        alert(result.message);
        return false;
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Failed to place order");
      return false;
    }
  };

  const handleCOD = async () => {
    setPaymentMethod("cash on delivery");
    const ok = await saveOrder();
    if (ok) {
      setTimeout(() => router.push("/Common/pages/Orders"), 2500);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-brand-cream animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-brand-orange hover:text-white transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
            <div className="flex flex-col items-center gap-5 p-6 border-b md:border-b-0 md:border-r border-gray-100">
              {product.data?.badge && product.data.badge !== "none" && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                  product.data.badge === "new"
                    ? "bg-pink-50 text-pink-700 border border-pink-200"
                    : product.data.badge === "sale"
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : product.data.badge === "out of stock"
                    ? "bg-brand-muted text-gray-500 border border-gray-200"
                    : product.data.badge === "limited stock"
                    ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    : "bg-sky-50 text-sky-700 border border-sky-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                    product.data.badge === "new"
                      ? "bg-pink-500"
                      : product.data.badge === "sale"
                      ? "bg-orange-500"
                      : product.data.badge === "out of stock"
                      ? "bg-gray-400"
                      : product.data.badge === "limited stock"
                      ? "bg-yellow-500"
                      : "bg-sky-500"
                  }`} />
                  {product.data.badge === "new" ? "New Arrival" : product.data.badge === "sale" ? "Sale" : product.data.badge === "out of stock" ? "Out of Stock" : product.data.badge === "limited stock" ? `Limited Stock - ${product.data.stock ?? 0}` : product.data.badge}
                </span>
              )}

              <div className="w-44 h-44 rounded-2xl bg-brand-cream border border-gray-100 flex items-center justify-center text-5xl">
                {product.data?.image ? (
                  <img src={`http://localhost:5000/uploads/${product.data.image}`} alt={product.data.itemName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span>🛍️</span>
                )}
              </div>

              {product.data?.colour && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">Colour:</span>
                  <span className="text-xs font-semibold text-brand-dark">{product.data.colour}</span>
                </div>
              )}

              <button
                onClick={handleAddtoCart}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-brand-dark bg-white border-2 border-brand-orange hover:bg-brand-orange hover:text-white transition-colors"
              >
                🛒 Add to cart
              </button>

              <button
                onClick={() => { setPaymentMethod("cash on delivery"); setShowPayment(true); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors"
              >
                💳 Buy Now
              </button>

              <div className="w-full pt-3 border-t border-gray-100 flex flex-col gap-2 text-xs text-gray-400">
                <span>🔒 Secure checkout</span>
                <span>🚚 Free delivery</span>
                <span>🔄 7-day returns</span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-xl font-semibold text-brand-dark leading-snug">
                  {product.data?.itemName || product.data?.description}
                </h1>
                {product.data?.category && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-orange bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {product.data.category}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1 bg-brand-dark text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                  ★ 4.3
                </span>
                <span className="text-sm text-gray-400">
                  2,514 ratings · 210 reviews
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-brand-dark">
                  ₹{finalPrice.toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-medium text-orange-600">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-gray-400 mb-6">
                Inclusive of all taxes
              </p>

              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Quantity {maxStock < 999 && <span className="text-orange-500 font-medium normal-case">(Max: {maxStock})</span>}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-brand-orange hover:text-white text-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-10 text-center text-brand-dark">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    disabled={quantity >= maxStock}
                    className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-brand-orange hover:text-white text-lg font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                {quantity >= maxStock && maxStock < 999 && (
                  <p className="text-[11px] text-orange-500 mt-1">Only {maxStock} items available</p>
                )}
              </div>

              <hr className="border-gray-100 mb-5" />

              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Product ID
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-dark bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg">
                  🔑 {product.data?.id}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  SKU
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-dark bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg">
                  🏷️ {product.data?.sku}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.data?.description}
                </p>
              </div>

              <div className="bg-brand-cream rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Available offers
                  </p>
                  <button
                    onClick={() => setOffers(!offers)}
                    className="text-xs font-medium text-brand-orange hover:text-brand-orange-hover"
                  >
                    {offers ? "Hide offers" : "View offers"}
                  </button>
                </div>
                {offers && (
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-700 text-xs font-medium rounded-lg px-3 py-2">
                      ⚡ 10% instant discount on HDFC cards
                    </div>
                    <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-medium rounded-lg px-3 py-2">
                      💳 ₹500 cashback on UPI payments
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium rounded-lg px-3 py-2">
                      🚚 Free delivery above ₹999
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && !orderPlaced && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-5 w-[380px] relative shadow-xl animate-scale-in">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-brand-orange transition-colors"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-brand-dark text-center mb-4">
              Choose Payment Method
            </h2>
            <div className="mb-4 bg-brand-cream border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Product</span>
                <span className="font-medium text-brand-dark">{product.data?.itemName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SKU</span>
                <span className="font-medium text-brand-dark">{product.data?.sku}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Quantity</span>
                <span className="font-medium text-brand-dark">{quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-brand-dark">{user?.email || "Not logged in"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-semibold text-brand-orange">₹{finalPrice.toLocaleString("en-IN")}</span>
              </div>
              <hr className="border-gray-200" />
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Mobile Number</label>
                <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Enter mobile number" className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Delivery Address</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter full delivery address" rows={2} className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-[13px] focus:outline-none focus:border-brand-orange transition-all resize-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <button onClick={() => setPaymentMethod("cash on delivery")} className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${paymentMethod === "cash on delivery" ? "border-brand-orange bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <span className="text-xl">💵</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-[11px] text-gray-400">Pay when you receive</p>
                </div>
                {paymentMethod === "cash on delivery" && <span className="ml-auto text-brand-orange text-sm">✓</span>}
              </button>
              <button onClick={() => setPaymentMethod("online")} className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${paymentMethod === "online" ? "border-brand-orange bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                <span className="text-xl">🌐</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Pay Online</p>
                  <p className="text-[11px] text-gray-400">Credit card / PayPal</p>
                </div>
                {paymentMethod === "online" && <span className="ml-auto text-brand-orange text-sm">✓</span>}
              </button>
            </div>

            {paymentMethod === "cash on delivery" ? (
              <button onClick={handleCOD} className="w-full py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                Place Order (COD)
              </button>
            ) : (
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID, currency: "USD" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                  createOrder={async () => {
                    const res = await fetch("http://localhost:5000/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ amount: finalPrice, itemName: product.data?.itemName, quantity }),
                    });
                    const data = await res.json();
                    return data.id;
                  }}
                  onApprove={async (data) => {
                    const res = await fetch("http://localhost:5000/api/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ orderID: data.orderID, quantity }),
                    });
                    const result = await res.json();
                    if (result.success) {
                      await saveOrder();
                      alert("Payment successful! Order placed. Delivery in 7 days.");
                    } else {
                      alert("Payment failed");
                    }
                    setShowPayment(false);
                  }}
                  onError={(err) => { console.log(err); alert("Payment Failed"); }}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      )}

      {orderPlaced && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-scale-in max-w-sm mx-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Order Placed!</h2>
            <p className="text-sm text-gray-400">Your order will be delivered in 7 days.</p>
            <p className="text-xs text-gray-300 mt-3 animate-pulse">Redirecting to your orders...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
