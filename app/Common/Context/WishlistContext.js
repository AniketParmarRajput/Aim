"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const loadWishlist = async (userId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/user/${userId}`);
      const result = await res.json();
      if (result.success) setItems(result.data);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/user/${user.id}`);
          const result = await res.json();
          if (active && result.success) setItems(result.data);
        } catch (err) {
          console.error("Failed to load wishlist:", err);
        }
      } else if (active) {
        setItems([]);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const isInWishlist = (productId) => items.some((item) => item.id === Number(productId));

  const toggleWishlist = (product) => {
    const exists = items.find((item) => item.id === Number(product.id));
    if (exists) {
      removeFromWishlist(exists.id);
    } else {
      addToWishlist(product);
    }
  };

  const addToWishlist = (product) => {
    if (!user?.id) return;
    const exists = items.some((item) => item.id === Number(product.id));
    if (exists) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, productId: product.id }),
    })
      .then((r) => r.json())
      .then(() => loadWishlist(user.id))
      .catch((err) => console.error("Failed to add to wishlist:", err));
  };

  const removeFromWishlist = (id) => {
    const item = items.find((i) => i.id === Number(id));
    if (item?.wishlistId && user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/remove/${item.wishlistId}`, { method: "DELETE" })
        .then(() => loadWishlist(user.id))
        .catch((err) => console.error("Failed to remove item:", err));
    } else {
      setItems((prev) => prev.filter((item) => item.id !== Number(id)));
    }
  };

  const clearWishlist = () => {
    if (user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/clear/${user.id}`, { method: "DELETE" })
        .catch((err) => console.error("Failed to clear wishlist:", err));
    }
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
        loadWishlist,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};