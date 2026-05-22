"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/prizing/getPrizing/${id}`
        );
        const result = await response.json();
        setProduct(result);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    if (id) fetchProductDetails();
  }, [id]);

  // ── Loading state ──
  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#f0f4ff] gap-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-[14px] font-semibold text-gray-400 animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4ff] px-4 py-8 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-blue-400/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-indigo-500 bg-indigo-50 px-3.5 py-2 rounded-lg mb-5 hover:bg-indigo-100 transition-colors"
        >
          ← Back to Products
        </button>

        {/* Main card */}
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.07)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">

            {/* ── Left: Image side ── */}
            <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/60 border-b md:border-b-0 md:border-r border-indigo-100 flex flex-col items-center justify-center gap-5 p-8">

              {/* In stock badge */}
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-[11px] font-bold px-3 py-1 rounded-full border border-green-100">
                ● In Stock
              </div>

              {/* Product image */}
              {/* <div className="w-44 h-44 rounded-2xl bg-white border border-indigo-100 shadow-md shadow-indigo-100/50 flex items-center justify-center overflow-hidden">
                {product.data?.image ? (
                  <Image
                    src={`http://localhost:5000/uploads/${product.data.image
                      .replace(/^.*[\\/]uploads[\\/]/, "")
                    }`}
                    alt={product.data?.itemName || "Product"}
                    width={176}
                    height={176}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-5xl">🛍️</span>
                )}
              </div> */}

              {/* Thumbnail strip */}
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-lg cursor-pointer transition-all ${
                      i === 0 ? "border-indigo-400 shadow-sm" : "border-gray-200"
                    }`}
                  >
                    🛍️
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2.5 w-full">
                <button className="w-full py-2.5 bg-orange-50 text-orange-600 border-[1.5px] border-orange-200 rounded-xl text-[13px] font-bold hover:bg-orange-100 transition-all">
                  🛒 ADD TO CART
                </button>
                <button className="w-full py-2.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl text-[13px] font-bold shadow-md shadow-orange-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                  ⚡ BUY NOW
                </button>
              </div>
            </div>

            {/* ── Right: Detail side ── */}
            <div className="p-7">

              {/* Product name */}
              <h1 className="text-[18px] font-bold text-gray-900 tracking-tight leading-snug mb-3">
                {product.data?.itemName || product.data?.description}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <span className="flex items-center gap-1 bg-green-600 text-white text-[11.5px] font-bold px-2.5 py-1 rounded-lg">
                  ★ 4.3
                </span>
                <span className="text-[12px] text-gray-400">
                  2,514 Ratings & 210 Reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-1">
                <span className="text-[30px] font-bold text-gray-900 tracking-tight">
                  <sup className="text-base align-super">₹</sup>
                  {Number(product.data?.amount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[13px] text-gray-400 line-through">
                  ₹{Math.round(Number(product.data?.amount) * 1.33).toLocaleString("en-IN")}
                </span>
                <span className="bg-green-50 text-green-600 text-[11.5px] font-bold px-2.5 py-1 rounded-full border border-green-100">
                  25% off
                </span>
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              {/* Product ID */}
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Product ID
              </p>
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-500 text-[12px] font-semibold px-3 py-1.5 rounded-lg border border-indigo-100 mb-4">
                🔑 {product.data?.id}
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              {/* Description */}
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Description
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                {product.data?.description}
              </p>

              <div className="h-px bg-gray-100 mb-4" />

              {/* Offers */}
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Available Offers
              </p>
              <div className="flex flex-col gap-2">
                {[
                  "Bank Offer — 10% off on HDFC Cards",
                  "Special Price — Get extra 25% off (price inclusive)",
                  "No Cost EMI available on select cards",
                  "Free Delivery on orders above ₹499",
                ].map((offer) => (
                  <div
                    key={offer}
                    className="flex items-center gap-2.5 text-[12.5px] text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2"
                  >
                    <div className="w-5 h-5 rounded-md bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600 text-xs">
                      ✓
                    </div>
                    {offer}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;