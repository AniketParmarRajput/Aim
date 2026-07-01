"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../Common/Context/CartContext";

const NAV_ITEMS = [
  { label: "Home",         route: "/Common/pages/home" },
  { label: "Our Products", route: "/Common/pages/Products" },
  { label: "Pricing",      route: "/Common/pages/Pricing" },
  { label: "About",        route: "/Common/pages/About" },
  { label: "Emp",          route: "/Common/pages/Employes" },
  { label: "Contact",      route: "/Common/pages/Contact" },
  { label: "Management",   route: "/Common/pages/Management" },
  { label: "Test",         route: "/Common/Test/interview" },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { items, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  if (pathname === "/" || pathname === "/Common/pages/login") return null;

  const logout = () => router.push("/Common/pages/login");

  return (
    <>
      <nav className="bg-brand-dark px-5 py-2.5 flex items-center gap-3 flex-wrap sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => router.push("/Common/pages/home")}>
          <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white text-sm">⚡</div>
          <span className="text-white text-[14px] font-medium">Easy Shop</span>
        </div>

        <div className="hidden md:flex items-center gap-0.5 flex-wrap">
          {NAV_ITEMS.map(({ label, route }) => (
            <button key={label} onClick={() => router.push(route)} className="text-white/60 hover:text-white hover:bg-white/10 text-[12px] px-2.5 py-1.5 rounded-md transition-colors">
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative cursor-pointer mr-1" onClick={() => setCartOpen(true)}>
            <span className="text-white text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <button onClick={logout} className="text-[12px] text-white/70 border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
            Log out
          </button>
          <button onClick={() => router.push("/")} className="text-[12px] font-medium text-blue-700 bg-white px-3.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
            Sign up
          </button>
        </div>
      </nav>

      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-5 flex flex-col animate-slide-in">
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
                    <div key={item.id} onClick={() => { setCartOpen(false); router.push(`/Common/pages/Products/${item.id}`); }} className="flex gap-3 bg-gray-50 rounded-lg p-2.5 cursor-pointer hover:bg-orange-50 transition-colors">
                      <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-xl shrink-0 overflow-hidden">
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
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center hover:bg-gray-300">-</button>
                          <span className="text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center hover:bg-gray-300">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 hover:text-red-600 text-xs">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3">
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
