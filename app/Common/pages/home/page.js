"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/Common/Context/CartContext";

const fmt = (n) => n.toLocaleString("en-IN");

const CATEGORY_ICONS = {
  Men: "👔", Women: "👗", Childs: "🧸", Other: "📦",
};

const ProductCard = ({ product, onAdd, onBuy }) => {
  const amount = Number(product.amount);
  const discountPct = Number(product.discount);
  const discountedPrice = discountPct > 0
    ? Math.round(amount - (amount * discountPct) / 100)
    : amount;

  return (
    <div
      onClick={() => onBuy(product)}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-5xl overflow-hidden">
        {product.image ? (
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.itemName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span>🛍️</span>
        )}
        {product.badge === "new" && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">New</span>
        )}
        {product.badge === "sale" && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Sale</span>
        )}
        {product.badge === "out of stock" && (
          <span className="absolute top-2 left-2 bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Out of Stock</span>
        )}
        {product.badge === "limited stock" && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Limited - {product.stock ?? 0}</span>
        )}
        {discountPct > 0 && (
          <span className="absolute top-2 right-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">-{discountPct}%</span>
        )}
      </div>
      <div className="p-3">
        <span className="text-[11px] text-brand-dark font-medium uppercase tracking-wide">{product.category || "General"}</span>
        <h3 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-1">{product.itemName}</h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-baseline gap-1.5 flex-wrap mt-2">
          <span className="text-[17px] font-bold text-gray-900">₹{fmt(discountedPrice)}</span>
          {discountPct > 0 && (
            <>
              <span className="text-[11px] text-gray-400 line-through">₹{fmt(amount)}</span>
              <span className="text-[11px] text-red-600 font-medium">-{discountPct}%</span>
            </>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={(e) => { e.stopPropagation(); onAdd(product); }} className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
            Add to cart
          </button>
          <button onClick={(e) => { e.stopPropagation(); onBuy(product); }} className="flex-1 bg-brand-dark hover:bg-[#0a1230] text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prizing/getPrizing");
        const result = await res.json();
        setProducts((result.data || []).filter((p) => p.active !== false));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="bg-gray-50 font-sans">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-brand-dark via-[#0f1d4a] to-brand-dark px-6 pt-14 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,115,22,0.12),transparent_60%)]" />
        <div className="relative z-10 max-w-6xl mx-auto text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-[11px] font-medium px-3 py-1 rounded-full mb-4 animate-fade-in">
            ⚡ New Collection 2026
          </span>
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-snug mb-3 animate-slide-up">
            Discover Your <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-400">Perfect Style</span>
          </h1>
          <p className="text-white/50 text-[14px] mb-6 max-w-lg mx-auto md:mx-0 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            Shop the latest trends with exclusive discounts. Free delivery on your first order!
          </p>
          <div className="flex gap-3 justify-center md:justify-start animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <button onClick={() => router.push("/Common/pages/Products")} className="bg-brand-orange hover:bg-brand-orange-hover text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-brand-orange/25">
              Shop Now
            </button>
            <button onClick={() => { const el = document.getElementById("products"); if (el) el.scrollIntoView({ behavior: "smooth" }); }} className="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-[13px] px-6 py-2.5 rounded-xl transition-all duration-300">
              Explore
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <h2 className="text-[16px] font-bold text-gray-900 mb-4">Shop by Category</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button key={cat} onClick={() => router.push("/Common/pages/Products")} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-2xl px-5 py-3 hover:border-brand-orange hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 shrink-0 group">
                  <span className="text-2xl">{CATEGORY_ICONS[cat] || "📦"}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-orange transition-colors">{cat}</p>
                    <p className="text-[11px] text-gray-400">{products.filter((p) => p.category === cat).length} items</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Promo */}
        {products.length > 0 && (
          <div className="relative bg-gradient-to-r from-brand-orange to-orange-500 rounded-2xl px-6 py-5 flex items-center justify-between gap-4 mb-8 overflow-hidden animate-slide-up">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5" />
            <div>
              <p className="text-white/80 text-[11px] mb-0.5 font-medium">🔥 Limited Time Offer</p>
              <p className="text-white text-[16px] font-bold">Up to 60% off on All Items</p>
            </div>
            <button onClick={() => router.push("/Common/pages/Products")} className="bg-white text-brand-orange text-[12px] font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 shadow-lg">
              Shop Now
            </button>
          </div>
        )}

        {/* Products */}
        <div id="products" className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-gray-900">Our Products</h2>
          {products.length > 0 && (
            <button onClick={() => router.push("/Common/pages/Products")} className="text-[12px] text-brand-orange font-medium hover:underline">See all →</button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {loading ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-20 animate-fade-in">
              <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400 animate-fade-in">
              <p className="text-5xl mb-3">📭</p>
              <p className="text-sm font-medium">No products found</p>
              <p className="text-xs text-gray-300 mt-1">Check back later for new arrivals</p>
            </div>
          ) : products.slice(0, 8).map((product, i) => (
            <div key={product.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}>
              <ProductCard
                product={product}
                onAdd={(product) => addToCart({ id: product.id, itemName: product.itemName, amount: product.amount, image: product.image, discount: product.discount })}
                onBuy={(product) => router.push(`/Common/pages/Products/${product.id}`)}
              />
            </div>
          ))}
        </div>

        {/* Features */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 mb-4">
            {[
              { icon: "🚚", label: "Free Delivery", sub: "Orders above ₹499" },
              { icon: "🔄", label: "Easy Returns", sub: "30-day return policy" },
              { icon: "🔒", label: "Secure Payment", sub: "100% secure checkout" },
              { icon: "💬", label: "24/7 Support", sub: "Dedicated customer care" },
            ].map((s, i) => (
              <div key={s.label} className="bg-white border border-gray-100 rounded-xl px-4 py-4 text-center hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}>
                <span className="text-2xl">{s.icon}</span>
                <p className="text-sm font-semibold text-gray-900 mt-1">{s.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
