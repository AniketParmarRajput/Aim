"use client";
import React, { useState } from "react";
import { useWishlist } from "@/app/Common/Context/WishlistContext";

const WishlistButton = ({ product, className = "", size = "w-8 h-8", iconSize = "text-base" }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [animating, setAnimating] = useState(false);
  const active = isInWishlist(product.id);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`relative ${size} rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
        active ? "bg-white text-red-500" : "bg-white/90 text-gray-400 hover:text-red-500"
      } ${animating ? "animate-wishlist-pop" : ""} ${className}`}
    >
      {animating && <span className="absolute inset-0 rounded-full bg-red-400/40 animate-wishlist-ring" />}
      <span className={`relative ${iconSize} transition-transform duration-200 ${animating ? "scale-125" : ""}`}>
        {active ? "❤️" : "🤍"}
      </span>
    </button>
  );
};

export default WishlistButton;