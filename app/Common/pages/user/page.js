"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHero from "@/app/Components/Reusable/PageHero";
import { useCart } from "../../Context/CartContext";
import { useWishlist } from "../../Context/WishlistContext";
import WishlistButton from "@/app/Components/Resuable/WishlistButton";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { addToCart, isInCart, openCart } = useCart();
  const { items: wishlistItems, clearWishlist } = useWishlist();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/Common/pages/login"); return; }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get-by-email/${user.email}`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setProfile(result.data);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, router]);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart({ id: item.id, itemName: item.itemName, amount: item.amount, image: item.image, discount: item.discount, stock: item.stock });
  };

  const getImg = (img) => (Array.isArray(img) ? img[0] : img);

  return (
    <div className="min-h-screen bg-brand-cream">
      <PageHero
        badge="👤 My Account"
        title="Welcome To Your"
        titleGradient="Profile"
        subtitle="View your account details, manage your profile, and enjoy a personalized shopping experience."
        showExplore={false}
        features={[
          { icon: "🛍️", title: "My Orders", sub: "Track purchases" },
          { icon: "🔐", title: "Secure Account", sub: "Protected login" },
          { icon: "❤️", title: "Wishlist", sub: "Saved favorites" },
          { icon: "🎁", title: "Offers", sub: "Personal deals" },
        ]}
      />
      <div className="px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-8 py-8">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center text-white text-2xl font-bold">
                  {(profile?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{profile?.name || "User"}</h1>
                  <p className="text-sm text-gray-400">{profile?.role === "admin" ? "Administrator" : profile?.role || "Customer"}</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-5" />

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">ID</label>
                  <p className="text-[15px] font-semibold text-gray-900">{profile?.id || "—"}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">Full Name</label>
                  <p className="text-[15px] font-semibold text-gray-900">{profile?.name || "—"}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">Email Address</label>
                  <p className="text-[15px] font-semibold text-gray-900">{profile?.email || "—"}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">Role</label>
                  <p className="text-[15px] font-semibold text-gray-900 capitalize">{profile?.role || "—"}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">Position</label>
                  <p className="text-[15px] font-semibold text-gray-900">{profile?.position || "—"}</p>
                </div>
              </div>
            </>
          )}

          <div className="h-px bg-gray-100 my-5" />

          <button onClick={() => router.push("/Common/pages/home")} className="w-full py-2.5 bg-brand-dark text-white rounded-xl text-[14px] font-bold hover:opacity-90 transition-all inline-flex items-center justify-center gap-2">
            <ArrowLeftIcon size={15} /> Back to Home
          </button>
        </div>

        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">❤️ My Wishlist</h2>
                <p className="text-sm text-gray-400 mt-0.5">{wishlistItems.length} saved item{wishlistItems.length === 1 ? "" : "s"}</p>
              </div>
              <div className="flex items-center gap-3">
                {wishlistItems.length > 0 && (
                  <button onClick={() => clearWishlist()} className="text-sm font-medium text-red-500 hover:text-red-700">
                    🗑️ Clear all
                  </button>
                )}
                {wishlistItems.length > 0 && (
                  <button onClick={() => router.push("/Common/pages/Products")} className="text-sm font-medium text-brand-orange hover:underline">
                    Browse more →
                  </button>
                )}
              </div>
            </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-4xl mb-3">🤍</p>
              <p className="text-sm font-medium text-gray-600">Your wishlist is empty</p>
              <p className="text-xs text-gray-400 mt-1">Save products you love and find them here</p>
              <button onClick={() => router.push("/Common/pages/Products")} className="mt-5 text-sm font-medium text-white bg-brand-orange hover:bg-brand-orange-hover px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
                Explore Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item) => {
                const outOfStock = item.badge === "out of stock" || Number(item.stock) === 0;
                const finalPrice = Math.round(Number(item.amount) * (1 - Number(item.discount) / 100));
                return (
                  <div
                    key={item.id}
                    onClick={() => router.push(`/Common/pages/Products/${item.id}`)}
                    className="group bg-brand-cream rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] bg-brand-muted flex items-center justify-center text-3xl overflow-hidden">
                      {item.image ? (
                        <img
                          src={(() => { const u = getImg(item.image); return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; })()}
                          alt={item.itemName}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${outOfStock ? "grayscale opacity-70" : ""}`}
                        />
                      ) : (
                        <span>📦</span>
                      )}
                      {Number(item.discount) > 0 && (
                        <span className="absolute top-2 right-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{item.discount}%</span>
                      )}
                      <div className="absolute top-2 left-2">
                        <WishlistButton product={item} size="w-7 h-7" iconSize="text-sm" />
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-1">{item.itemName}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-base font-bold text-gray-900">₹{finalPrice.toLocaleString("en-IN")}</span>
                        {Number(item.discount) > 0 && (
                          <span className="text-xs text-gray-400 line-through">₹{Number(item.amount).toLocaleString("en-IN")}</span>
                        )}
                      </div>
                      <button
                        disabled={outOfStock}
                        onClick={(e) => { e.stopPropagation(); isInCart(item.id) ? openCart() : handleAddToCart(e, item); }}
                        className={`w-full mt-2.5 py-2 text-[11px] font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 ${isInCart(item.id) ? "bg-brand-orange hover:bg-brand-orange-hover text-white" : "bg-brand-dark hover:bg-[#0a1230] text-white"}`}
                      >
                        {outOfStock ? "Out of Stock" : isInCart(item.id) ? "Go to Cart" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
