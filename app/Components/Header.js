"use client";
import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../Common/Context/AuthContext";
import { useCart } from "../Common/Context/CartContext";
import { useSidebar } from "../Common/Context/SidebarContext";
import { useWishlist } from "../Common/Context/WishlistContext";
import CartSidebar from "./cartSidebar";
import WishlistSidebar from "./WishlistSidebar";

const NAV_ITEMS = [
  { label: "Home", route: "/Common/pages/home", icon: "🏠" },
  { label: "Products", route: "/Common/pages/Products", icon: "🛍️" },
  { label: "About", route: "/Common/pages/About", icon: "ℹ️" },
  { label: "Contact", route: "/Common/pages/Contact", icon: "📞" },
  { label: "Orders", route: "/Common/pages/Orders", icon: "📦" },
  { label: "Management", route: "/Common/pages/Management", icon: "⚙️" },
];

const Header = () => {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const { wishlistCount, wishlistOpen, setWishlistOpen } = useWishlist();
  const { sidebarOpen, setSidebarOpen, closeSidebar } = useSidebar();
  const [userData, setUserData] = useState(null);

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
      {/* Mobile top header bar - logo + hamburger toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-brand-dark flex items-center justify-between px-3 py-2.5 shadow-lg">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateAndClose("/Common/pages/home")}>
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-tan to-brand-orange flex items-center justify-center text-white text-sm shadow-md overflow-hidden">
            <img src="/websitelogo-circle.png" alt="Easy Shop logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">
            <span className="text-white">Easy</span> <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-tan to-yellow-300">Shop</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col py-4 shadow-lg bg-brand-dark transition-transform duration-300 ease-in-out w-72 md:w-56 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center gap-2.5 px-4 pb-4 border-b border-white/10 cursor-pointer shrink-0" onClick={() => navigateAndClose("/Common/pages/home")}>
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-tan to-brand-orange flex items-center justify-center text-white text-base shadow-md overflow-hidden">
            <img src="/websitelogo-circle.png" alt="Easy Shop logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">
            <span className="text-white">Easy</span> <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-tan to-yellow-300">Shop</span>
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
          <div 
            className="relative cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-light/10 transition-colors" 
            onClick={() => { setWishlistOpen(true); setCartOpen(false); closeSidebar(); }}
          >
            <span className="text-white text-xl">❤️</span>
            <span className="text-white/60 text-[13px]">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ml-auto">
                {wishlistCount}
              </span>
            )}
          </div>
          <div 
            className="relative cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-light/10 transition-colors" 
            onClick={() => { setCartOpen(true); setWishlistOpen(false); closeSidebar(); }}
          >
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

      {/* Cart Sidebar Component */}
      {mounted && (
        <CartSidebar 
          isOpen={cartOpen} 
          onClose={() => setCartOpen(false)} 
        />
      )}

      {/* Wishlist Sidebar Component */}
      {mounted && (
        <WishlistSidebar 
          isOpen={wishlistOpen} 
          onClose={() => setWishlistOpen(false)} 
        />
      )}
    </>
  );
};

export default Header;