"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/app/Common/Context/CartContext";
import { useAuth } from "@/app/Common/Context/AuthContext";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { addToCart, isInCart, openCart } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const productInCart = isInCart(Number(id));

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [offers, setOffers] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const maxStock = Number(product?.data?.stock) || 999;

  const fmt = (n) => n.toLocaleString("en-IN");
  const getImg = (img) => (Array.isArray(img) ? img[0] : img);

  const addToCartWithItem = (item) =>
    addToCart({ id: item.id, itemName: item.itemName, amount: item.amount, image: item.image, discount: item.discount, stock: item.stock });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [prodRes, allRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prizing/getPrizing`),
        ]);
        const prodResult = await prodRes.json();
        const allResult = await allRes.json();
        setProduct(prodResult);
        setAllProducts((allResult.data || []).filter((p) => p.active !== false));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    if (id) fetchAll();
  }, [id]);

  const related = allProducts.filter(
    (p) => p.category === product?.data?.category && p.id !== product?.data?.id
  );

  const totalPrice = Number(product?.data?.amount || 0) * quantity;
  const discount = Number(product?.data?.discount || 0);
  const discountedPrice = discount > 0
    ? Math.round(totalPrice - (totalPrice * discount) / 100)
    : totalPrice;
  const finalPrice = discount > 0 ? discountedPrice : totalPrice;

  const handleAddtoCart = () => {
    addToCart({
      id: product.data?.id,
      itemName: product.data?.itemName,
      amount: product.data?.amount,
      image: product.data?.image,
      discount: product.data?.discount,
      stock: product.data?.stock,
      quantity,
    });
  };

  const SimilarCard = ({ item }) => {
    const [added, setAdded] = useState(false);
    const amount = Number(item.amount);
    const discountPct = Number(item.discount);
    const outOfStock = item.badge === "out of stock" || Number(item.stock) === 0;
    const inCart = isInCart(item.id);
    const discountedPrice = discountPct > 0
      ? Math.round(amount - (amount * discountPct) / 100)
      : amount;

    const handleAdd = (e) => {
      e.stopPropagation();
      addToCartWithItem(item);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    };

    const handleGoToCart = (e) => {
      e.stopPropagation();
      openCart();
    };

    return (
      <div className="w-full bg-brand-light border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
        <div onClick={() => router.push(`/Common/pages/Products/${item.id}`)} className="relative aspect-[4/3] bg-gradient-to-br from-brand-cream to-brand-muted flex items-center justify-center text-4xl overflow-hidden">
          {item.image ? (
            <img
              src={(() => { const u = getImg(item.image); return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; })()}
              alt={item.itemName}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${outOfStock ? "grayscale opacity-70" : ""}`}
            />
          ) : (
            <span>🛍️</span>
          )}
          {item.badge === "new" && (
            <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">New</span>
          )}
          {item.badge === "sale" && (
            <span className="absolute top-2 left-2 bg-brand-dark text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Sale</span>
          )}
          {item.badge === "out of stock" && (
            <span className="absolute top-2 left-2 bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Out of Stock</span>
          )}
          {item.badge === "limited stock" && (
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
                <button disabled={item.badge === "out of stock" || Number(item.stock) === 0} onClick={(e) => { if (item.badge !== "out of stock" && Number(item.stock) !== 0) { e.stopPropagation(); router.push(`/Common/pages/Products/${item.id}`); } }} className="flex-1 bg-brand-dark hover:bg-[#1f0f08] text-white text-[11px] font-medium py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100">{item.badge === "out of stock" || Number(item.stock) === 0 ? "Out of Stock" : "Buy now"}</button>
              </div>
            )}
          </div>
        </div>
        <div className="p-3">
          <span className="text-[11px] text-brand-dark font-medium uppercase tracking-wide">{item.category || "General"}</span>
          <h3 onClick={() => router.push(`/Common/pages/Products/${item.id}`)} className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-1 hover:text-brand-dark transition-colors">{item.itemName}</h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
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
                  <img src={(() => { const u = Array.isArray(product.data.image) ? product.data.image[0] : product.data.image; return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; })()} alt={product.data.itemName} className={`w-full h-full object-cover rounded-2xl ${product.data?.badge === "out of stock" || Number(product.data?.stock) === 0 ? "grayscale opacity-70" : ""}`} />
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
                onClick={productInCart ? openCart : handleAddtoCart}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${productInCart ? "text-white bg-brand-orange hover:bg-brand-orange-hover" : "text-brand-dark bg-white border-2 border-brand-orange hover:bg-brand-orange hover:text-white"}`}
              >
                {productInCart ? "🛒 Go to cart" : "🛒 Add to cart"}
              </button>

              <button
                onClick={() => router.push(`/Common/pages/checkout?productId=${product.data.id}&quantity=${quantity}`)}
                disabled={product.data?.badge === "out of stock" || Number(product.data?.stock) === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-brand-orange hover:bg-brand-orange-hover transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                💳 {product.data?.badge === "out of stock" || Number(product.data?.stock) === 0 ? "Out of Stock" : "Buy Now"}
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

              {isAdmin && (
                <>
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
                </>
              )}

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

        {related.length > 0 && (
          <div className="mt-10 animate-slide-up">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-[16px] font-bold text-gray-900">Similar Products</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  More from {product.data?.category}
                </p>
              </div>
              <button
                onClick={() => router.push("/Common/pages/Products")}
                className="text-[12px] text-brand-dark font-medium hover:underline"
              >
                View All →
              </button>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {related.map((item, i) => (
                <div
                  key={item.id}
                  className="min-w-[190px] w-[190px] shrink-0 animate-slide-up"
                  style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "both" }}
                >
                  <SimilarCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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

export default Page;
