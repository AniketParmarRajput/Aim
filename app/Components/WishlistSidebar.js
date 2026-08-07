// components/Common/Header/WishlistSidebar.js
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "../Common/Context/WishlistContext";

const WishlistSidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { items: wishlistItems, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-80 bg-brand-light shadow-xl z-50 p-5 flex flex-col animate-slide-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your Wishlist ({wishlistCount})</h2>
          <div className="flex items-center gap-2">
            {wishlistItems.length > 0 && (
              <button 
                onClick={() => clearWishlist()} 
                className="text-xs font-medium text-red-500 hover:text-red-700"
              >
                Clear all
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">Your wishlist is empty.</p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 mb-4">
              {wishlistItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => { 
                    onClose(); 
                    router.push(`/Common/pages/Products/${item.id}`); 
                  }} 
                  className="flex gap-3 bg-brand-cream rounded-lg p-2.5 cursor-pointer hover:bg-brand-cream transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-brand-muted flex items-center justify-center text-xl shrink-0 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={(() => { 
                          const u = Array.isArray(item.image) ? item.image[0] : item.image; 
                          return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; 
                        })()} 
                        alt={item.itemName} 
                        className={`w-full h-full object-cover ${Number(item.stock) === 0 ? "grayscale opacity-70" : ""}`} 
                      />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.itemName}</p>
                    <div className="flex items-center gap-1.5">
                      {Number(item.discount) > 0 && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{Number(item.amount).toLocaleString("en-IN")}
                        </span>
                      )}
                      <p className="text-sm font-bold text-brand-dark">
                        ₹{Math.round(Number(item.amount) * (1 - (Number(item.discount) || 0) / 100)).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        removeFromWishlist(item.id); 
                      }} 
                      className="mt-1 text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-muted pt-3">
              <button 
                onClick={() => { 
                  onClose(); 
                  router.push("/Common/pages/Products"); 
                }} 
                className="w-full py-2.5 bg-brand-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WishlistSidebar;