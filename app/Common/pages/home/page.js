"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Card from "@/app/Components/Resuable/Card";
import { useAuth } from "../../Context/AuthContext";

const Home = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handle = (item) => {
    const routes = {
      Home: "/",
      "Our Products": "/Common/pages/Products",
      Pricing: "/Common/pages/Pricing",
      About: "/Common/pages/About",
      Emp: "/Common/pages/Employes",
      Contact: "/Common/pages/Contact",
      Mail: "/Common/pages/Mail",
      Test: "/Common/Test/interview",
    };
    router.push(routes[item]);
  };

  const handleClick = (cardType) => {
    switch (cardType) {
      case "All":
        router.push(`/Common/pages/Employes?cardType=${cardType}`);
        break;
      case "deleted":
        router.push(`/Common/pages/About?cardType=${cardType}`);
        break;
      default:
        router.push(`/Common/Test/interviwe?cardType=${cardType}`);
        break;
    }
  };

  return (
    <>
      {/* ── Hero Banner ── */}
      <div className="relative w-full h-100 md:h-140 lg:h-170  overflow-hidden shadow-xl bg-[#0b1437]">

        {/* Background Image */}
        <Image
          src="/web.jpg"
          alt="Web Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] opacity-45"
        />

        {/* Overlay — strong left fade so nav text stays readable */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0a1232]/90 via-[#0a1232]/50 to-transparent" />

        {/* ── Navbar ── */}
        <nav className="absolute top-0 left-0 w-full px-6 py-4 flex items-center justify-between z-10">

          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => handle("Home")}
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
              ⚡
            </div>
            <span className="font-bold text-[15px] text-white tracking-tight">
              YourBrand
            </span>
          </div>

          {/* Nav links — plain text, no borders */}
          <div className="hidden md:flex items-center">
            {["Home", "Our Products", "Pricing", "About", "Emp", "Contact", "Mail", "Test"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => handle(item)}
                  className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150 whitespace-nowrap"
                >
                  {item}
                </button>
              )
            )}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2 sshrink-0">
            <button
              onClick={logout}
              className="text-[12px] font-medium text-white/75 border border-white/20 px-3.5 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-150"
            >
              Log out
            </button>
            <button className="px-4 py-1.5 bg-white text-blue-700 rounded-lg text-[12px] font-bold hover:bg-blue-50 transition-colors duration-150">
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero text */}
        <div className="absolute bottom-7 left-6 z-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-semibold px-3 py-1 rounded-full mb-3 tracking-wide">
            Dashboard
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-bold leading-snug tracking-tight">
            Welcome back to
            <br />
            <span className="text-blue-400">YourBrand</span>
          </h1>
        </div>
      </div>

      {/* ── Cards Row ── */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <Card title="All"      onClick={() => handleClick("All")} />
        <Card title="deleted"  onClick={() => handleClick("deleted")} />
        <Card title="Restored" onClick={() => handleClick("Restored")} />
      </div>
    </>
  );
};

export default Home;