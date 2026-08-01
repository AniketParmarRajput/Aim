"use client";

import React from "react";
import { useRouter } from "next/navigation";

const PageHero = ({
  badge = "⚡ New Collection 2026",
  title = "Discover Your",
  titleGradient = "Perfect Style",
  subtitle = "Shop the latest trends with exclusive discounts up to 60% off. Free delivery on your first order!",
  showExplore = true,
  features = [
    { icon: "🛍️", title: "New Arrivals", sub: "2026 Collection" },
    { icon: "🏷️", title: "Big Sale", sub: "Up to 60% off" },
    { icon: "🚚", title: "Free Ship", sub: "On first order" },
    { icon: "⭐", title: "Top Rated", sub: "4.8 avg rating" },
  ],
}) => {
  const router = useRouter();

  return (
    <div className="relative bg-gradient-to-br from-brand-dark via-[#3D2B1F] to-brand-dark px-6 pt-16 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,115,85,0.15),transparent_60%)]" />
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-brand-light/10 border border-white/20 text-white/80 text-[11px] font-medium px-3 py-1 rounded-full mb-4 animate-fade-in">
              {badge}
            </span>
            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-3 animate-slide-up">
              {title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-tan to-yellow-300">{titleGradient}</span>
            </h1>
            <p className="text-white/50 text-[15px] mb-6 max-w-lg animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              {subtitle}
            </p>
            <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <button onClick={() => router.push("/Common/pages/Products")} className="bg-brand-dark hover:bg-[#1f0f08] text-white text-[13px] font-semibold px-7 py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20">
                Shop Now
              </button>
              {showExplore && (
                <button onClick={() => { const el = document.getElementById("products"); if (el) el.scrollIntoView({ behavior: "smooth" }); }} className="bg-brand-light/10 hover:bg-brand-light/15 text-white border border-white/20 text-[13px] px-7 py-3 rounded-xl transition-all duration-300">
                  Explore
                </button>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <div className="relative">
              <div className="w-72 h-72 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl absolute -top-10 -left-10" />
              <div className="relative grid grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={f.title} className={`bg-brand-light/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center ${i === 1 ? "mt-6" : i === 2 ? "-mt-3" : ""}`}>
                    <span className="text-3xl">{f.icon}</span>
                    <p className="text-white text-sm font-semibold mt-1">{f.title}</p>
                    <p className="text-white/50 text-[10px]">{f.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHero;
