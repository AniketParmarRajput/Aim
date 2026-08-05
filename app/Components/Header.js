"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../Common/Context/CartContext";
import { useAuth } from "../Common/Context/AuthContext";
import { useSidebar } from "../Common/Context/SidebarContext";

const NAV_ITEMS = [
  { label: "Home", route: "/Common/pages/home", icon: "🏠" },
  { label: "Products", route: "/Common/pages/Products", icon: "🛍️" },
  { label: "About", route: "/Common/pages/About", icon: "ℹ️" },
  { label: "Contact", route: "/Common/pages/Contact", icon: "📞" },
  { label: "Orders", route: "/Common/pages/Orders", icon: "📦" },
  { label: "Management", route: "/Common/pages/Management", icon: "⚙️" },
];

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();
  const { items, cartCount, cartTotal, removeFromCart, updateQuantity, cartOpen, setCartOpen } = useCart();
  const { sidebarOpen, setSidebarOpen, closeSidebar } = useSidebar();
  const [userData, setUserData] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get-by-email/${user.email}`)
        .then((r) => r.json())
        .then((res) => { if (res.success) setUserData(res.data); })
        .catch(() => {});
    }
  }, [user?.email]);

  const displayName = userData?.name || user?.name || "User";

  const isAdmin = mounted && user?.role === "admin";
  const adminOnly = ["Management"];
  const userOnly = ["Orders"];
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (userOnly.includes(item.label) && isAdmin) return false;
    if (adminOnly.includes(item.label) && !isAdmin) return false;
    return true;
  });

  const handleLogout = () => { closeSidebar(); authLogout(); };
  const navigateAndClose = (route) => { router.push(route); closeSidebar(); };

  return (
    <>
      {/* Hamburger button - mobile only */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden bg-brand-dark text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg hover:bg-brand-dark/90 transition-colors"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-brand-dark z-50 flex flex-col py-4 shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2.5 px-4 pb-4 border-b border-white/10 cursor-pointer shrink-0" onClick={() => navigateAndClose("/Common/pages/home")}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-tan to-brand-orange flex items-center justify-center text-white text-base shadow-md overflow-hidden">
            <img src="/websitelogo-circle.png" alt="Easy Shop logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">
            <span className="text-white">Easy</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-tan to-yellow-300">Shop</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide px-2 py-4 space-y-1">
          {visibleNavItems.map(({ label, route, icon }) => (
            <button
              key={label}
              onClick={() => navigateAndClose(route)}
              className="w-full flex items-center gap-3 text-white/60 hover:text-white hover:bg-brand-light/10 text-[13px] px-3 py-2.5 rounded-lg transition-colors text-left"
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 pt-4 border-t border-white/10 space-y-2">
          <div className="relative cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-light/10 transition-colors" onClick={() => { setCartOpen(true); closeSidebar(); }}>
            <span className="text-white text-xl">🛒</span>
            <span className="text-white/60 text-[13px]">Cart</span>
            {cartCount > 0 && (
              <span className="bg-brand-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ml-auto">
                {cartCount}
              </span>
            )}
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 text-[13px] text-white/70 border border-white/20 px-3 py-2.5 rounded-lg hover:bg-brand-light/10 hover:text-white transition-colors text-left">
            <span>🚪</span>
            <span>{mounted && user ? "Log out" : "Log in"}</span>
          </button>
          {mounted && user ? (
            <div onClick={() => navigateAndClose("/Common/pages/user")} className="bg-brand-light/10 rounded-xl p-3 cursor-pointer hover:bg-brand-light/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <p className="text-white text-[13px] font-semibold truncate">{displayName}</p>
              </div>
            </div>
          ) : (
            <button onClick={() => navigateAndClose("/")} className="w-full flex items-center gap-3 text-[13px] font-medium text-blue-700 bg-brand-light px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-left">
              <span>📝</span>
              <span>Sign up</span>
            </button>
          )}
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
                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} onClick={() => { setCartOpen(false); router.push(`/Common/pages/Products/${item.id}`); }} className="flex gap-3 bg-brand-cream rounded-lg p-2.5 cursor-pointer hover:bg-brand-cream transition-colors">
                      <div className="w-14 h-14 rounded-lg bg-brand-muted flex items-center justify-center text-xl shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={(() => { const u = Array.isArray(item.image) ? item.image[0] : item.image; return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; })()} alt={item.itemName} className={`w-full h-full object-cover ${Number(item.stock) === 0 ? "grayscale opacity-70" : ""}`} />
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
                  <button onClick={() => { setCartOpen(false); router.push("/Common/pages/checkout"); }} className="w-full py-2.5 bg-brand-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors">
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
