"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../Common/Context/CartContext";
import { useAuth } from "../Common/Context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", route: "/Common/pages/home", icon: "🏠" },
  { label: "Products", route: "/Common/pages/Products", icon: "🛍️" },
  { label: "Pricing", route: "/Common/pages/Pricing", icon: "💰" },
  { label: "About", route: "/Common/pages/About", icon: "ℹ️" },
  { label: "Emp", route: "/Common/pages/Employes", icon: "👥" },
  { label: "Contact", route: "/Common/pages/Contact", icon: "📞" },
  { label: "Orders", route: "/Common/pages/Orders", icon: "📦" },
  { label: "Management", route: "/Common/pages/Management", icon: "⚙️" },
];

const Header = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { items, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const adminOnly = ["Pricing", "Management", "Emp"];
  const visibleNavItems = NAV_ITEMS.filter((item) => !adminOnly.includes(item.label) || isAdmin);

  const logout = () => router.push("/Common/pages/login");

  return (
    <>
      <aside className="fixed top-0 left-0 h-full w-56 bg-brand-dark z-50 flex flex-col py-4 shadow-lg">
        <div className="flex items-center gap-2 px-4 pb-4 border-b border-white/10 cursor-pointer shrink-0" onClick={() => router.push("/Common/pages/home")}>
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white text-sm">⚡</div>
          <span className="text-white text-[14px] font-medium">Easy Shop</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {visibleNavItems.map(({ label, route, icon }) => (
            <button
              key={label}
              onClick={() => router.push(route)}
              className="w-full flex items-center gap-3 text-white/60 hover:text-white hover:bg-brand-light/10 text-[13px] px-3 py-2.5 rounded-lg transition-colors text-left"
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 pt-4 border-t border-white/10 space-y-2">
          <div className="relative cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-light/10 transition-colors" onClick={() => setCartOpen(true)}>
            <span className="text-white text-xl">🛒</span>
            <span className="text-white/60 text-[13px]">Cart</span>
            {cartCount > 0 && (
              <span className="bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ml-auto">
                {cartCount}
              </span>
            )}
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 text-[13px] text-white/70 border border-white/20 px-3 py-2.5 rounded-lg hover:bg-brand-light/10 hover:text-white transition-colors text-left">
            <span>🚪</span>
            <span>Log out</span>
          </button>
          <button onClick={() => router.push("/")} className="w-full flex items-center gap-3 text-[13px] font-medium text-blue-700 bg-brand-light px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-left">
            <span>📝</span>
            <span>Sign up</span>
          </button>
        </div>
      </aside>

      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-brand-light shadow-xl z-50 p-5 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Your Cart ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {items.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-10">Your cart is empty.</p>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} onClick={() => { setCartOpen(false); router.push(`/Common/pages/Products/${item.id}`); }} className="flex gap-3 bg-brand-cream rounded-lg p-2.5 cursor-pointer hover:bg-brand-cream transition-colors">
                      <div className="w-14 h-14 rounded-lg bg-brand-muted flex items-center justify-center text-xl shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.itemName} className="w-full h-full object-cover" />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.itemName}</p>
                        <div className="flex items-center gap-1.5">
                          {Number(item.discount) > 0 && (
                            <span className="text-[11px] text-gray-400 line-through">₹{Number(item.amount).toLocaleString("en-IN")}</span>
                          )}
                          <p className="text-sm font-bold text-brand-dark">₹{Math.round(Number(item.amount) * (1 - (Number(item.discount) || 0) / 100)).toLocaleString("en-IN")}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }} className="w-6 h-6 rounded-full bg-brand-muted text-gray-600 text-xs flex items-center justify-center hover:bg-gray-300">-</button>
                          <span className="text-xs font-medium">{item.quantity}</span>
                          <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }} className="w-6 h-6 rounded-full bg-brand-muted text-gray-600 text-xs flex items-center justify-center hover:bg-gray-300">+</button>
                          <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }} className="ml-auto text-red-400 hover:text-red-600 text-xs">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-muted pt-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-brand-dark">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <button className="w-full py-2.5 bg-brand-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Header;
