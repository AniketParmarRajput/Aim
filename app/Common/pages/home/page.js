"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/Common/Context/CartContext";
import Reveal from "@/app/Components/Reusable/Reveal";
import WishlistButton from "@/app/Components/Resuable/WishlistButton";

const fmt = (n) => n.toLocaleString("en-IN");

const CATEGORY_ICONS = {
  Men: "👔", Women: "👗", Childs: "🧸", Other: "📦",
};

const getImg = (img) => Array.isArray(img) ? img[0] : img;

const ProductCard = ({ product, onAdd, onBuy }) => {
  const { isInCart, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const amount = Number(product.amount);
  const discountPct = Number(product.discount);
  const outOfStock = product.badge === "out of stock" || Number(product.stock) === 0;
  const inCart = isInCart(product.id);
  const discountedPrice = discountPct > 0
    ? Math.round(amount - (amount * discountPct) / 100)
    : amount;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleGoToCart = (e) => {
    e.stopPropagation();
    openCart();
  };

  return (
    <div className="w-full bg-brand-light border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
      <div onClick={() => onBuy(product)} className="relative aspect-[4/3] bg-gradient-to-br from-brand-cream to-brand-muted flex items-center justify-center text-4xl overflow-hidden">
        {product.image ? (
          <img
            src={(() => { const u = getImg(product.image); return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; })()}
            alt={product.itemName}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${outOfStock ? "grayscale opacity-70" : ""}`}
          />
        ) : (
          <span>🛍️</span>
        )}
        {product.badge === "new" && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">New</span>
        )}
        {product.badge === "sale" && (
          <span className="absolute top-2 left-2 bg-brand-dark text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Sale</span>
        )}
        {product.badge === "out of stock" && (
          <span className="absolute top-2 left-2 bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Out of Stock</span>
        )}
        {product.badge === "limited stock" && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Limited</span>
        )}
        {discountPct > 0 && (
          <span className="absolute top-2 right-2 bg-brand-dark text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">-{discountPct}%</span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {inCart ? (
            <button onClick={handleGoToCart} className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
              Go to cart
            </button>
          ) : added ? (
            <div className="text-center text-white text-[11px] font-medium py-1.5">Added ✓</div>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleAdd} className="flex-1 bg-brand-dark hover:bg-[#1f0f08] text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">Add to cart</button>
              <button disabled={product.badge === "out of stock" || Number(product.stock) === 0} onClick={(e) => { if (product.badge !== "out of stock" && Number(product.stock) !== 0) { e.stopPropagation(); onBuy(product); } }} className="flex-1 bg-brand-dark hover:bg-[#1f0f08] text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100">{product.badge === "out of stock" || Number(product.stock) === 0 ? "Out of Stock" : "Buy now"}</button>
            </div>
          )}
        </div>
      
      </div>
      <div className="p-3">
        <span className="text-[11px] text-brand-dark font-medium uppercase tracking-wide">{product.category || "General"}</span>
          <div className="absolute bottom-2 right-2 z-10">
          <WishlistButton product={product} />
        </div>
        <h3 onClick={() => onBuy(product)} className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-1 hover:text-brand-dark transition-colors">{product.itemName}</h3>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 mt-1.5">
          {[1,2,3,4,5].map((s) => (
            <span key={s} className={`text-[11px] ${s <= 4 ? "text-yellow-400" : "text-gray-300"}`}>★</span>
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(24)</span>
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap mt-2">
          <span className="text-[17px] font-bold text-gray-900">₹{fmt(discountedPrice)}</span>
          {discountPct > 0 && (
            <>
              <span className="text-[11px] text-gray-400 line-through">₹{fmt(amount)}</span>
              <span className="text-[11px] text-red-600 font-medium bg-red-50 px-1.5 py-0.5 rounded">-{discountPct}%</span>
            </>
          )}
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
  const [activeTab, setActiveTab] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  // Refs for scroll containers
  const bigSaleScrollRef = useRef(null);
  const topDealsScrollRef = useRef(null);
  const newArrivalsScrollRef = useRef(null);

  // Scroll functions
  const scrollContainer = (ref, direction, amount = 320) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -amount : amount;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing`);
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

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const filtered = useMemo(() => {
    return activeTab === "All" ? products : products.filter((p) => p.category === activeTab);
  }, [products, activeTab]);

  const deals = useMemo(() => products.filter((p) => Number(p.discount) > 0).sort((a, b) => Number(b.discount) - Number(a.discount)), [products]);
  const bigDeals = useMemo(() => products.filter((p) => Number(p.discount) >= 50).sort((a, b) => Number(b.discount) - Number(a.discount)), [products]);
  const newArrivals = useMemo(() => products.slice(-7).reverse(), [products]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="bg-brand-cream font-sans min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-brand-dark via-[#3D2B1F] to-brand-dark px-6 pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,115,85,0.15),transparent_60%)]" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-brand-light/10 border border-white/20 text-white/80 text-[11px] font-medium px-3 py-1 rounded-full mb-4 animate-fade-in">
                ⚡ New Collection 2026
              </span>
              <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-3 animate-slide-up">
                Discover Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-tan to-yellow-300">Perfect Style</span>
              </h1>
              <p className="text-white/50 text-[15px] mb-6 max-w-lg animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
                Shop the latest trends with exclusive discounts up to 60% off. Free delivery on your first order!
              </p>
              <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
                <button onClick={() => router.push("/Common/pages/Products")} className="bg-brand-dark hover:bg-[#1f0f08] text-white text-[13px] font-semibold px-7 py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20">
                  Shop Now
                </button>
                <button onClick={() => { const el = document.getElementById("products"); if (el) el.scrollIntoView({ behavior: "smooth" }); }} className="bg-brand-light/10 hover:bg-brand-light/15 text-white border border-white/20 text-[13px] px-7 py-3 rounded-xl transition-all duration-300">
                  Explore
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
              <div className="relative">
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl absolute -top-10 -left-10" />
                <div className="relative grid grid-cols-2 gap-3">
                  <div className="bg-brand-light/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                    <span className="text-3xl">🛍️</span>
                    <p className="text-white text-sm font-semibold mt-1">New Arrivals</p>
                    <p className="text-white/50 text-[10px]">2026 Collection</p>
                  </div>
                  <div className="bg-brand-light/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center mt-6">
                    <span className="text-3xl">🏷️</span>
                    <p className="text-white text-sm font-semibold mt-1">Big Sale</p>
                    <p className="text-white/50 text-[10px]">Up to 60% off</p>
                  </div>
                  <div className="bg-brand-light/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center -mt-3">
                    <span className="text-3xl">🚚</span>
                    <p className="text-white text-sm font-semibold mt-1">Free Ship</p>
                    <p className="text-white/50 text-[10px]">On first order</p>
                  </div>
                  <div className="bg-brand-light/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                    <span className="text-3xl">⭐</span>
                    <p className="text-white text-sm font-semibold mt-1">Top Rated</p>
                    <p className="text-white/50 text-[10px]">4.8 avg rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Categories */}
        {categories.length > 1 && (
          <Reveal direction="up" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-gray-900">Shop by Category</h2>
              <button onClick={() => router.push("/Common/pages/Products")} className="text-[12px] text-brand-dark font-medium hover:underline">View All</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.filter((c) => c !== "All").map((cat) => (
                <button key={cat} onClick={() => { setActiveTab(cat); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }} className="flex items-center gap-2.5 bg-brand-light border border-gray-200 rounded-2xl px-5 py-3 hover:border-brand-dark/30 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 shrink-0 group">
                  <span className="text-2xl">{CATEGORY_ICONS[cat] || "📦"}</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-dark transition-colors">{cat}</p>
                    <p className="text-[11px] text-gray-400">{products.filter((p) => p.category === cat).length} items</p>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Promo Banner */}
        {products.length > 0 && (
          <Reveal direction="up" className="mb-8">
            <div className="relative bg-gradient-to-r from-brand-dark via-[#3D2B1F] to-brand-dark rounded-2xl px-6 py-6 flex items-center justify-between gap-4 overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full bg-brand-light/5" />
              <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-brand-light/5" />
              <div>
                <p className="text-white/80 text-[11px] mb-0.5 font-medium">🔥 Limited Time Offer</p>
                <p className="text-white text-lg font-bold">Up to 60% off on All Items</p>
                <p className="text-white/60 text-[11px] mt-1">Use code: <span className="text-white font-bold">SAVE60</span></p>
              </div>
              <button onClick={() => router.push("/Common/pages/Products")} className="bg-brand-light text-brand-dark text-[12px] font-bold px-6 py-3 rounded-xl hover:bg-brand-cream transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 shadow-lg">
                Shop Now →
              </button>
            </div>
          </Reveal>
        )}

        {/* Big Sale */}
        {bigDeals.length > 0 && (
          <Reveal direction="up" className="mb-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-900">🔥 Big Sale</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">50% or more off — grab them fast!</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => scrollContainer(bigSaleScrollRef, 'left')}
                    className="w-8 h-8 rounded-full bg-brand-light border border-gray-200 flex items-center justify-center text-lg hover:bg-brand-dark hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={() => scrollContainer(bigSaleScrollRef, 'right')}
                    className="w-8 h-8 rounded-full bg-brand-light border border-gray-200 flex items-center justify-center text-lg hover:bg-brand-dark hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div 
                ref={bigSaleScrollRef} 
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {bigDeals.map((product, i) => (
                  <div key={product.id} className="min-w-[190px] w-[190px] shrink-0 animate-slide-up" style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}>
                    <ProductCard
                      product={product}
                      onAdd={(product) => addToCart({ id: product.id, itemName: product.itemName, amount: product.amount, image: product.image, discount: product.discount })}
                      onBuy={(product) => router.push(`/Common/pages/Products/${product.id}`)}
                    />
                  </div>
                ))}
                <div className="shrink-0 flex items-center">
                  <button onClick={() => router.push("/Common/pages/Products")} className="text-[11px] text-brand-orange font-medium border border-brand-orange px-4 py-2 rounded-lg hover:bg-brand-orange hover:text-white transition-all whitespace-nowrap">View All →</button>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <Reveal direction="up" className="mb-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-900">🆕 New Arrivals</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Freshly added — the latest items</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => scrollContainer(newArrivalsScrollRef, 'left')}
                    className="w-8 h-8 rounded-full bg-brand-light border border-gray-200 flex items-center justify-center text-lg hover:bg-brand-dark hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={() => scrollContainer(newArrivalsScrollRef, 'right')}
                    className="w-8 h-8 rounded-full bg-brand-light border border-gray-200 flex items-center justify-center text-lg hover:bg-brand-dark hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    ›
                  </button>
                  <button onClick={() => router.push("/Common/pages/Products")} className="text-[12px] text-brand-dark font-medium hover:underline ml-2">View All →</button>
                </div>
              </div>
              <div 
                ref={newArrivalsScrollRef} 
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {newArrivals.map((product, i) => (
                  <div key={product.id} className="min-w-[190px] w-[190px] shrink-0 animate-slide-up" style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}>
                    <ProductCard
                      product={product}
                      onAdd={(product) => addToCart({ id: product.id, itemName: product.itemName, amount: product.amount, image: product.image, discount: product.discount })}
                      onBuy={(product) => router.push(`/Common/pages/Products/${product.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Top Deals */}
        {deals.length > 0 && (
          <Reveal direction="up" className="mb-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-900">🔥 Top Deals</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Best discounts available now</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => scrollContainer(topDealsScrollRef, 'left')}
                    className="w-8 h-8 rounded-full bg-brand-light border border-gray-200 flex items-center justify-center text-lg hover:bg-brand-dark hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={() => scrollContainer(topDealsScrollRef, 'right')}
                    className="w-8 h-8 rounded-full bg-brand-light border border-gray-200 flex items-center justify-center text-lg hover:bg-brand-dark hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    ›
                  </button>
                  <button onClick={() => router.push("/Common/pages/Products")} className="text-[12px] text-brand-dark font-medium hover:underline ml-2">See all →</button>
                </div>
              </div>
              <div 
                ref={topDealsScrollRef} 
                className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {deals.slice(0, 8).map((product, i) => (
                  <div key={product.id} className="min-w-[190px] w-[190px] shrink-0 animate-slide-up" style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}>
                    <ProductCard
                      product={product}
                      onAdd={(product) => addToCart({ id: product.id, itemName: product.itemName, amount: product.amount, image: product.image, discount: product.discount })}
                      onBuy={(product) => router.push(`/Common/pages/Products/${product.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Category Tabs + Products */}
        <div id="products">
          <Reveal direction="up">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-[16px] font-bold text-gray-900">
                  {activeTab === "All" ? "All Products" : activeTab}
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">{filtered.length} items available</p>
              </div>
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => { setActiveTab(cat); setVisibleCount(8); }} className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all duration-200 shrink-0 ${activeTab === cat ? "bg-brand-dark text-white shadow-md" : "bg-brand-light text-gray-600 border border-gray-200 hover:border-brand-dark/30 hover:text-brand-dark"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {loading ? (
              <div className="col-span-full flex flex-col items-center gap-3 py-20 animate-fade-in">
                <div className="w-10 h-10 border-3 border-brand-dark/30 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-medium">Loading products...</p>
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400 animate-fade-in">
                <p className="text-5xl mb-3">📭</p>
                <p className="text-sm font-medium">No products found in this category</p>
                <p className="text-xs text-gray-300 mt-1">Try selecting a different category</p>
              </div>
            ) : visibleProducts.map((product, i) => (
              <Reveal key={product.id} direction="up" delay={Math.min(i * 0.05, 0.4)}>
                <ProductCard
                  product={product}
                  onAdd={(product) => addToCart({ id: product.id, itemName: product.itemName, amount: product.amount, image: product.image, discount: product.discount })}
                  onBuy={(product) => router.push(`/Common/pages/Products/${product.id}`)}
                />
              </Reveal>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button onClick={() => setVisibleCount((prev) => prev + 8)} className="bg-brand-light border border-gray-200 text-gray-700 text-[13px] font-medium px-8 py-3 rounded-xl hover:border-brand-dark/30 hover:text-brand-dark transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>

        {/* Features */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 mb-8">
            {[
              { icon: "🚚", label: "Free Delivery", sub: "Orders above ₹499" },
              { icon: "🔄", label: "Easy Returns", sub: "30-day return policy" },
              { icon: "🔒", label: "Secure Payment", sub: "100% secure checkout" },
              { icon: "💬", label: "24/7 Support", sub: "Dedicated customer care" },
            ].map((s, i) => (
              <Reveal key={s.label} direction="up" delay={i * 0.1} className="h-full">
                <div className="bg-brand-light border border-gray-100 rounded-xl px-4 py-5 text-center hover:shadow-md transition-all duration-300 group h-full">
                  <span className="text-2xl group-hover:scale-110 inline-block transition-transform duration-300">{s.icon}</span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{s.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* CSS for scrollbar hiding */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Home;