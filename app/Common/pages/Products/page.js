"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/Common/Context/CartContext";

const CATEGORIES = ["All", "Men", "Women", "Childs", "Other"];
const BADGE_FILTERS = ["All", "New", "Sale", "Out of Stock", "Discounted"];

const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [badge, setBadge] = useState("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const router = useRouter();
  const { addToCart } = useCart();

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

  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchBadge =
      badge === "All" ||
      (badge === "Discounted" ? Number(p.discount) > 0 : p.badge === badge.toLowerCase());
    const amt = Number(p.amount);
    const matchMin = !priceMin || amt >= Number(priceMin);
    const matchMax = !priceMax || amt <= Number(priceMax);
    return matchCat && matchBadge && matchMin && matchMax;
  });

  const activeCount = [category !== "All", badge !== "All", priceMin || priceMax].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400">{filtered.length} items</p>
        </div>
        <button onClick={() => setFilterOpen(true)} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95">
          <span>⚙️</span> Filters
          {activeCount > 0 && <span className="bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>}
        </button>
      </div>

      {/* Product Grid */}
      <div className="px-6 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex flex-col items-center gap-3 py-20 animate-fade-in">
            <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400 animate-fade-in">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">No products found.</p>
          </div>
        ) : filtered.map((item, i) => (
          <div
            key={item.id}
            onClick={() => router.push(`/Common/pages/Products/${item.id}`)}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer animate-slide-up"
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}
          >
            <div className="relative aspect-square bg-gray-50 flex items-center justify-center text-4xl">
              {item.image ? (
                <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.itemName} className="w-full h-full object-cover" />
              ) : (
                <span>📦</span>
              )}
              {item.badge === "new" && <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>}
              {item.badge === "sale" && <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Sale</span>}
              {item.badge === "out of stock" && <span className="absolute top-2 left-2 bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Out of Stock</span>}
              {item.badge === "limited stock" && <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Limited Stock - {item.stock ?? 0}</span>}
              {Number(item.discount) > 0 && <span className="absolute top-2 right-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{item.discount}%</span>}
            </div>
            <div className="p-3">
              <span className="text-[11px] text-brand-dark font-medium uppercase">{item.category || "General"}</span>
              <h3 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-1">{item.itemName}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-gray-900">₹{Math.round(Number(item.amount) * (1 - Number(item.discount) / 100)).toLocaleString("en-IN")}</span>
                {Number(item.discount) > 0 && (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{Number(item.amount).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-red-600 font-medium">-{item.discount}%</span>
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={(e) => { e.stopPropagation(); addToCart({ id: item.id, itemName: item.itemName, amount: item.amount, image: item.image, discount: item.discount }); }} className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">Add to cart</button>
                <button onClick={(e) => { e.stopPropagation(); router.push(`/Common/pages/Products/${item.id}`); }} className="flex-1 bg-brand-dark hover:bg-[#0a1230] text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">Buy now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Side Modal */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setFilterOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 p-5 overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} className="accent-orange-500" />
                    <span className="text-sm text-gray-600">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Type</h3>
              <div className="space-y-2">
                {BADGE_FILTERS.map((b) => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="badge" checked={badge === b} onChange={() => setBadge(b)} className="accent-orange-500" />
                    <span className="text-sm text-gray-600">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" />
                <span className="text-gray-400">-</span>
                <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" />
              </div>
            </div>

            <button onClick={() => { setCategory("All"); setBadge("All"); setPriceMin(""); setPriceMax(""); }} className="w-full py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              Clear all filters
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
