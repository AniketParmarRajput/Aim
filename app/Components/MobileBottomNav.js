"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "../Common/Context/CartContext";
import { useAuth } from "../Common/Context/AuthContext";
import { useWishlist } from "../Common/Context/WishlistContext";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const { user } = useAuth();
  const { wishlistCount, setWishlistOpen } = useWishlist();

  const accountPath = user ? "/Common/pages/user" : "/Common/pages/login";

  const tabs = [
    {
      key: "home",
      label: "Home",
      icon: Home,
      active: pathname === "/Common/pages/home",
      onClick: () => router.push("/Common/pages/home"),
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: Heart,
      count: wishlistCount,
      active: false,
      onClick: () => setWishlistOpen(true),
    },
    {
      key: "cart",
      label: "Cart",
      icon: ShoppingCart,
      count: cartCount,
      active: cartOpen || pathname === "/Common/pages/checkout",
      onClick: () => setCartOpen(true),
    },
    {
      key: "account",
      label: "Profile",
      icon: User,
      active: pathname === accountPath || pathname === "/" || pathname === "/Common/pages/login",
      onClick: () => router.push(accountPath),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 w-full md:hidden bg-brand-dark border-t border-white/10 rounded-t-[18px] shadow-[0_-4px_16px_rgba(0,0,0,0.3)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={tab.onClick}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 shrink-0 min-h-[44px] py-2 transition-colors"
              aria-label={tab.label}
            >
              {tab.active && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-b-full bg-brand-tan" />
              )}
              <span className={`relative transition-colors ${tab.active ? "text-brand-tan" : "text-white/60"}`}>
                <Icon
                  size={22}
                  strokeWidth={tab.active ? 2.4 : 1.8}
                />
                {tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    {tab.count}
                  </span>
                )}
              </span>
              <span className={`text-[10px] leading-none whitespace-nowrap ${tab.active ? "text-brand-tan font-semibold" : "text-white/60"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;