"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // ✅ Quantity State
  const [quantity, setQuantity] = useState(1);

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

  // ✅ Total Price
  const totalPrice = Number(product?.data?.amount || 0) * quantity;

  // ✅ Add To Cart
  const handleAddtoCart = (id) => {
    console.log("Add to cart:", {
      id,
      quantity,
      totalPrice,
    });

    // Add your cart logic here
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f5f7ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7ff] px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">

            {/* LEFT PANEL */}
            <div className="flex flex-col items-center gap-5 p-6 border-b md:border-b-0 md:border-r border-gray-100">

              {/* Stock Badge */}
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                In Stock
              </span>

              {/* Product Image */}
              <div className="w-44 h-44 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-5xl">
                🛍️
              </div>

              {/* Add To Cart */}
              <button
                onClick={() => handleAddtoCart(id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                🛒 Add to cart
              </button>

              {/* Proceed To Payment */}
              <button
                onClick={() => setShowPayment(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                💳 Proceed to Payment
              </button>

              {/* Trust Signals */}
              <div className="w-full pt-3 border-t border-gray-100 flex flex-col gap-2 text-xs text-gray-400">
                <span>🔒 Secure checkout</span>
                <span>🚚 Fast shipping</span>
                <span>🔄 Easy returns</span>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="p-6 md:p-8">

              {/* Product Name */}
              <h1 className="text-xl font-semibold text-gray-900 leading-snug mb-4">
                {product.data?.itemName || product.data?.description}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                  ★ 4.3
                </span>

                <span className="text-sm text-gray-400">
                  2,514 ratings · 210 reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  ₹
                  {(totalPrice * 1.3).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </span>

                <span className="text-sm font-medium text-green-600">
                  23% off
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-6">
                Inclusive of all taxes
              </p>

              {/* ✅ Quantity Section */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Quantity
                </p>

                <div className="flex items-center gap-3">

                  {/* Minus */}
                  <button
                    onClick={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-lg font-semibold"
                  >
                    -
                  </button>

                  {/* Quantity */}
                  <span className="text-lg font-semibold w-10 text-center">
                    {quantity}
                  </span>

                  {/* Plus */}
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-lg font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 mb-5" />

              {/* Product ID */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Product ID
                </p>

                <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-500 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
                  🔑 {product.data?.id}
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </p>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.data?.description}
                </p>
              </div>

              {/* Offers */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Available offers
                  </p>

                  <button
                    onClick={() => setOffers(!offers)}
                    className="text-xs font-medium text-indigo-500 hover:text-indigo-600"
                  >
                    {offers ? "Hide offers" : "View offers"}
                  </button>
                </div>

                {offers && (
                  <div className="mt-3 flex flex-col gap-2">

                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs font-medium rounded-lg px-3 py-2">
                      ⚡ 10% instant discount on HDFC cards
                    </div>

                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium rounded-lg px-3 py-2">
                      💳 ₹500 cashback on UPI payments
                    </div>

                    <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-medium rounded-lg px-3 py-2">
                      🚚 Free delivery above ₹999
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT POPUP */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white rounded-2xl p-5 w-[380px] relative shadow-xl">

            {/* Close */}
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-3 right-4 text-xl text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-center mb-4">
              Complete Payment
            </h2>

            {/* Order Summary */}
            <div className="mb-4 bg-gray-50 border border-gray-100 rounded-xl p-4">

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Product</span>
                <span className="font-medium">
                  {product.data?.itemName}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Quantity</span>
                <span className="font-medium">{quantity}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-semibold text-indigo-600">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: "USD",
              }}
            >
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "gold",
                  shape: "rect",
                  label: "paypal",
                }}

                // ✅ Create Order
                createOrder={async () => {
                  try {
                    const response = await fetch(
                      "http://localhost:5000/api/paypal/create-order",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                          amount: totalPrice,
                          itemName: product.data?.itemName,
                          quantity,
                        }),
                      }
                    );

                    const data = await response.json();

                    return data.id;
                  } catch (err) {
                    console.log(err);
                  }
                }}

                // ✅ Payment Success
                onApprove={async (data) => {
                  try {
                    const response = await fetch(
                      "http://localhost:5000/api/paypal/capture-order",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                          orderID: data.orderID,
                          quantity,
                        }),
                      }
                    );

                    await response.json();

                    alert("Payment Successful");

                    setShowPayment(false);
                  } catch (err) {
                    console.log(err);

                    alert("Payment Failed");
                  }
                }}

                // ✅ Payment Error
                onError={(err) => {
                  console.log(err);

                  alert("Payment Failed");
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;