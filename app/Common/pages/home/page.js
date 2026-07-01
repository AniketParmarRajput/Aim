"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/Common/Context/CartContext";

// ─── Product Data ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "boAt Airdopes 141 Wireless Earbuds",
    emoji: "🎧",
    bg: "bg-blue-50",
    price: 1299,
    original: 4990,
    rating: 4,
    reviews: 89421,
    badge: "Sale",
    badgeColor: "bg-red-50 text-red-700",
  },
  {
    id: 2,
    name: "Nike Air Max 270 Running Shoes",
    emoji: "👟",
    bg: "bg-purple-50",
    price: 5995,
    original: 9995,
    rating: 5,
    reviews: 12840,
    badge: "New",
    badgeColor: "bg-green-50 text-green-700",
  },
  {
    id: 3,
    name: "Fossil Gen 6 Smartwatch",
    emoji: "⌚",
    bg: "bg-amber-50",
    price: 14995,
    original: 24995,
    rating: 4,
    reviews: 5632,
    badge: "Hot",
    badgeColor: "bg-orange-50 text-orange-700",
  },
  {
    id: 4,
    name: "Amazon Echo Dot 5th Gen",
    emoji: "🔊",
    bg: "bg-sky-50",
    price: 3499,
    original: 4999,
    rating: 5,
    reviews: 67800,
    badge: "Top",
    badgeColor: "bg-blue-50 text-blue-700",
  },
  {
    id: 5,
    name: "Prestige Iris Mixer Grinder",
    emoji: "🏠",
    bg: "bg-teal-50",
    price: 2299,
    original: 3999,
    rating: 4,
    reviews: 18900,
    badge: "Sale",
    badgeColor: "bg-red-50 text-red-700",
  },
  {
    id: 6,
    name: "Yoga Mat Anti-Slip 6mm",
    emoji: "🧘",
    bg: "bg-green-50",
    price: 799,
    original: 1599,
    rating: 5,
    reviews: 9870,
    badge: "Sale",
    badgeColor: "bg-red-50 text-red-700",
  },
  {
    id: 7,
    name: "Atomic Habits — James Clear",
    emoji: "📚",
    bg: "bg-yellow-50",
    price: 399,
    original: 799,
    rating: 5,
    reviews: 44200,
    badge: "Top",
    badgeColor: "bg-blue-50 text-blue-700",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt  = (n) => n.toLocaleString("en-IN");
const disc = (p, o) => Math.round((1 - p / o) * 100);
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onAdd, onBuy }) => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors cursor-pointer">
    {/* Image area */}
    <div className={`relative aspect-square flex items-center justify-center text-5xl ${product.bg}`}>
      {product.emoji}
      <span
        className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${product.badgeColor}`}
      >
        {product.badge}
      </span>
    </div>

    {/* Body */}
    <div className="p-3">
      <p className="text-[13px] text-gray-800 leading-snug line-clamp-2 mb-1.5">
        {product.name}
      </p>

      {/* Stars + reviews */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-amber-400 text-[11px] tracking-tight">{stars(product.rating)}</span>
        <span className="text-[11px] text-gray-400">{fmt(product.reviews)}</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 flex-wrap mb-2.5">
        <span className="text-[17px] font-medium text-gray-900">
          <span className="text-[11px] align-top mt-0.5 inline-block">₹</span>
          {fmt(product.price)}
        </span>
        <span className="text-[11px] text-gray-400 line-through">₹{fmt(product.original)}</span>
        <span className="text-[11px] text-red-600">-{disc(product.price, product.original)}%</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-medium py-1.5 rounded-full transition-colors"
        >
          Add to cart
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onBuy(product); }}
          className="flex-1 bg-brand-dark hover:bg-[#0a1230] text-white text-[11px] font-medium py-1.5 rounded-full transition-colors"
        >
          Buy now
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Home = () => {
  const router = useRouter();
  const { addToCart } = useCart();

  return (
    <div className="bg-gray-50 font-sans">

      {/* ── Hero ── */}
      <div className="bg-brand-dark px-6 pt-10 pb-12 relative overflow-hidden">
        <span className="inline-flex items-center gap-1.5 bg-blue-500/15 border border-blue-400/25 text-blue-300 text-[11px] font-medium px-3 py-1 rounded-full mb-4">
          Dashboard
        </span>
        <h1 className="text-white text-2xl md:text-3xl font-medium leading-snug mb-2">
          Welcome back to<br />
          <span className="text-blue-400">Easy Shop</span>
        </h1>
        <p className="text-white/50 text-[13px] mb-5">
          Manage your store, employees and orders from one place.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/Common/pages/Products")}
            className="bg-brand-orange hover:bg-brand-orange-hover text-white text-[12px] font-medium px-4 py-2 rounded-lg transition-colors"
          >
            View products
          </button>
          <button className="bg-white/10 hover:bg-white/15 text-white/80 border border-white/15 text-[12px] px-4 py-2 rounded-lg transition-colors">
            Explore store
          </button>
        </div>

        {/* Decorative circle */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-blue-400/15 bg-blue-500/5 items-center justify-center text-5xl text-blue-400/20">
          🏪
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 py-5">

        {/* Promo banner */}
        <div className="bg-brand-dark rounded-xl px-5 py-4 flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-white/50 text-[11px] mb-0.5">Limited time offer</p>
            <p className="text-white text-[14px] font-medium">Up to 60% off on Electronics</p>
          </div>
          <button
            onClick={() => router.push("/Common/pages/Products")}
            className="bg-brand-orange hover:bg-brand-orange-hover text-white text-[12px] font-medium px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            Shop now
          </button>
        </div>

        {/* Products heading */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-medium text-gray-800">Our products</h2>
          <button
            onClick={() => router.push("/Common/pages/Products")}
            className="text-[12px] text-blue-600 hover:underline"
          >
            See all
          </button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={(product) => addToCart({ id: product.id, itemName: product.name, amount: product.price, image: null })}
              onBuy={(product) => router.push(`/Common/pages/Products/${product.id}`)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;