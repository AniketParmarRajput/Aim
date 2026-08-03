"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/Common/Context/CartContext";
import PageHero from "@/app/Components/Reusable/PageHero";

const CATEGORIES = ["All", "Men", "Women", "Childs", "Other"];
const BADGE_FILTERS = ["All", "New", "Sale", "Out of Stock", "Discounted", "Big Discount"];
const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
];

const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [badge, setBadge] = useState("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const router = useRouter();
  const { addToCart, isInCart, openCart } = useCart();

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart({ id: item.id, itemName: item.itemName, amount: item.amount, image: item.image, discount: item.discount, stock: item.stock });
  };

  const handleGoToCart = (e) => {
    e.stopPropagation();
    openCart();
  };

  console.log(process.env.NEXT_PUBLIC_API_URL,)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
      const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing`
);
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

  // lock body scroll while the filter drawer is open
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen]);

  // close drawer on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setFilterOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchBadge =
        badge === "All" ||
        (badge === "Discounted" ? Number(p.discount) > 0 : badge === "Big Discount" ? Number(p.discount) >= 50 : p.badge === badge.toLowerCase());
      const amt = Number(p.amount);
      const matchMin = !priceMin || amt >= Number(priceMin);
      const matchMax = !priceMax || amt <= Number(priceMax);
      return matchCat && matchBadge && matchMin && matchMax;
    });

    const withFinalPrice = (p) => Number(p.amount) * (1 - Number(p.discount || 0) / 100);

    switch (sortBy) {
      case "price_low":
        return [...list].sort((a, b) => withFinalPrice(a) - withFinalPrice(b));
      case "price_high":
        return [...list].sort((a, b) => withFinalPrice(b) - withFinalPrice(a));
      case "discount":
        return [...list].sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
      default:
        return list;
    }
  }, [products, category, badge, priceMin, priceMax, sortBy]);

  const activeCount = [category !== "All", badge !== "All", priceMin || priceMax].filter(Boolean).length;

  const clearFilters = () => {
    setCategory("All");
    setBadge("All");
    setPriceMin("");
    setPriceMax("");
  };

  const removeChip = (type) => {
    if (type === "category") setCategory("All");
    if (type === "badge") setBadge("All");
    if (type === "price") {
      setPriceMin("");
      setPriceMax("");
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <PageHero
        badge="🛍️ Explore Our Products"
        title="Shop Our Latest"
        titleGradient="Collection"
        subtitle="Browse the best products at unbeatable prices with exclusive discounts up to 60% off. Free delivery on your first order!"
        features={[
          { icon: "🏷️", title: "Best Prices", sub: "Unbeatable offers" },
          { icon: "🔥", title: "Big Discounts", sub: "Up to 60% off" },
          { icon: "🚚", title: "Free Ship", sub: "On first order" },
          { icon: "⭐", title: "Top Rated", sub: "4.8 avg rating" },
        ]}
      />
      {/* Header */}
      <div className="bg-brand-light/95 backdrop-blur border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-400">
              {loading ? "Loading…" : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="hidden sm:block text-sm text-gray-600 bg-brand-muted border-none rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-brand-muted hover:bg-brand-muted px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>⚙️</span> Filters
              {activeCount > 0 && (
                <span className="bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {category !== "All" && (
              <Chip label={category} onClear={() => removeChip("category")} />
            )}
            {badge !== "All" && <Chip label={badge} onClear={() => removeChip("badge")} />}
            {(priceMin || priceMax) && (
              <Chip
                label={`₹${priceMin || 0} - ₹${priceMax || "∞"}`}
                onClear={() => removeChip("price")}
              />
            )}
            <button onClick={clearFilters} className="text-[11px] font-medium text-brand-orange hover:underline ml-1">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="px-6 py-6">
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm font-medium text-gray-600">No products match your filters</p>
            <p className="text-xs text-gray-400 mt-1">Try widening your price range or clearing a filter.</p>
            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm font-medium text-white bg-brand-orange hover:bg-brand-orange-hover px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          (() => {
            const groups = {};
            filtered.forEach((p) => {
              const cat = p.category || "General";
              if (!groups[cat]) groups[cat] = [];
              groups[cat].push(p);
            });
            return Object.entries(groups).map(([cat, items]) => (
              <div key={cat} className="mb-8 last:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[17px] font-bold text-gray-900">{cat}</h2>
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-[11px] text-gray-400">{items.length} items</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {items.map((item, i) => {
                    const outOfStock = item.badge === "out of stock" || Number(item.stock) === 0;
                    const finalPrice = Math.round(Number(item.amount) * (1 - Number(item.discount) / 100));
                    return (
                      <div
                        key={item.id}
                        onClick={() => router.push(`/Common/pages/Products/${item.id}`)}
                        className="group bg-brand-light rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 cursor-pointer animate-slide-up"
                        style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}
                      >
                        <div className="relative aspect-[4/3] bg-brand-cream flex items-center justify-center text-4xl overflow-hidden">
                          {item.image ? (
                            <img
                              src={(() => {
                                const u = Array.isArray(item.image) ? item.image[0] : item.image;
                                return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`;
                              })()}
                              alt={item.itemName}
                              loading="lazy"
                              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? "grayscale opacity-70" : ""}`}
                            />
                          ) : (
                            <span>📦</span>
                          )}

                          {item.badge === "new" && <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>}
                          {item.badge === "sale" && <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Sale</span>}
                          {item.badge === "out of stock" && <span className="absolute top-2 left-2 bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Out of Stock</span>}
                          {item.badge === "limited stock" && <span className="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Limited Stock - {item.stock ?? 0}</span>}
                          {Number(item.discount) >= 50 && <span className="absolute top-10 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">BIG SALE</span>}
                          {Number(item.discount) > 0 && <span className="absolute top-2 right-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{item.discount}%</span>}

                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {isInCart(item.id) ? (
                              <button
                                onClick={handleGoToCart}
                                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                              >
                                Go to cart
                              </button>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  disabled={outOfStock}
                                  onClick={(e) => handleAddToCart(e, item)}
                                  className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                  Add to cart
                                </button>
                                <button
                                  disabled={outOfStock}
                                  onClick={(e) => {
                                    if (!outOfStock) {
                                      e.stopPropagation();
                                      router.push(`/Common/pages/Products/${item.id}`);
                                    }
                                  }}
                                  className="flex-1 bg-brand-dark hover:bg-[#0a1230] text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                  {outOfStock ? "Out of Stock" : "Buy now"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-2.5">
                          <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-1">{item.itemName}</h3>
                          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-base font-bold text-gray-900">₹{finalPrice.toLocaleString("en-IN")}</span>
                            {Number(item.discount) > 0 && (
                              <>
                                <span className="text-xs text-gray-400 line-through">₹{Number(item.amount).toLocaleString("en-IN")}</span>
                                <span className="text-xs text-red-600 font-medium">-{item.discount}%</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()
        )}
      </div>

      {/* Filter Side Modal */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={() => setFilterOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-72 bg-brand-light shadow-xl z-50 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="mb-6 sm:hidden">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort by</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-sm text-gray-600 bg-brand-muted border-none rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" checked={category === cat} onChange={() => setCategory(cat)} className="accent-black" />
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
                      <input type="radio" name="badge" checked={badge === b} onChange={() => setBadge(b)} className="accent-black" />
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
            </div>

            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full py-2.5 text-sm font-medium text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Show {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </button>
              <button onClick={clearFilters} className="w-full py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                Clear all filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Chip = ({ label, onClear }) => (
  <span className="flex items-center gap-1 bg-brand-muted text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-full">
    {label}
    <button onClick={onClear} className="text-gray-400 hover:text-gray-700 leading-none">✕</button>
  </span>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="bg-brand-light rounded-xl border border-gray-100 overflow-hidden">
        <div className="aspect-[4/3] bg-brand-muted animate-pulse" />
        <div className="p-2.5 space-y-2">
          <div className="h-3 w-3/4 bg-brand-muted rounded animate-pulse" />
          <div className="h-2.5 w-1/2 bg-brand-muted rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-brand-muted rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default Page;