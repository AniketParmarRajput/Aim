"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Package, User } from "lucide-react";
import { useCart } from "../Common/Context/CartContext";
import { useAuth } from "../Common/Context/AuthContext";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const { user } = useAuth();

  const tabs = [
    {
      key: "home",
      label: "Home",
      icon: Home,
      active: pathname === "/Common/pages/home",
      onClick: () => router.push("/Common/pages/home"),
    },
    {
      key: "products",
      label: "Products",
      icon: ShoppingBag,
      active: pathname.startsWith("/Common/pages/Products"),
      onClick: () => router.push("/Common/pages/Products"),
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
      key: "orders",
      label: "Orders",
      icon: Package,
      active: pathname === "/Common/pages/Orders" || pathname.startsWith("/Common/pages/Orders/"),
      onClick: () => router.push("/Common/pages/Orders"),
    },
    {
      key: "account",
      label: "Account",
      icon: User,
      active: pathname === "/Common/pages/user" || pathname === "/Common/pages/login" || pathname === "/",
      onClick: () => router.push(user ? "/Common/pages/user" : "/"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={tab.onClick}
              className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors"
              aria-label={tab.label}
            >
              {tab.active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-brand-orange" />
              )}
              <span className="relative">
                <Icon
                  size={22}
                  strokeWidth={tab.active ? 2.4 : 1.8}
                  className={tab.active ? "text-brand-orange" : "text-gray-400"}
                />
                {tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </span>
              <span className={`text-[10px] leading-none ${tab.active ? "text-brand-orange font-semibold" : "text-gray-500"}`}>
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
