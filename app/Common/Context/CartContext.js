"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const loadCart = async (userId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/user/${userId}`);
      const result = await res.json();
      if (result.success) setItems(result.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/user/${user.id}`);
          const result = await res.json();
          if (active && result.success) setItems(result.data);
        } catch (err) {
          console.error("Failed to load cart:", err);
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

  const addToCart = (product) => {
    const qty = Number(product.quantity) || 1;
    if (user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity: qty }),
      })
        .then((r) => r.json())
        .then(() => loadCart(user.id))
        .catch((err) => console.error("Failed to add to cart:", err));
    } else {
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        }
        return [...prev, { ...product, quantity: qty }];
      });
    }
  };

  const removeFromCart = (id) => {
    const item = items.find((i) => i.id === id);
    if (item?.cartId && user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/remove/${item.cartId}`, { method: "DELETE" })
        .then(() => loadCart(user.id))
        .catch((err) => console.error("Failed to remove item:", err));
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = (id, delta) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    if (item.cartId && user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/update/${item.cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      })
        .then(() => loadCart(user.id))
        .catch((err) => console.error("Failed to update quantity:", err));
    } else {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: newQty } : it)));
    }
  };

  const clearCart = () => {
    if (user?.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear/${user.id}`, { method: "DELETE" })
        .catch((err) => console.error("Failed to clear cart:", err));
    }
    setItems([]);
  };

  const isInCart = (productId) => items.some((item) => item.id === productId);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const getDiscountedPrice = (item) => {
    const amount = Number(item.amount);
    const discount = Number(item.discount) || 0;
    return discount > 0 ? Math.round(amount - (amount * discount) / 100) : amount;
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + getDiscountedPrice(item) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        openCart,
        closeCart,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
