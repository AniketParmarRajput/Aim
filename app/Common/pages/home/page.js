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
    };

    router.push(routes[item]);
  };

  const handleClick = (cardType) =>{
    switch(cardType){
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
  }



  return (
    <>
    <div
      className="
        relative w-full
        h-[400px]
        md:h-[560px]
        lg:h-[680px]
        rounded-2xl
        overflow-hidden
        shadow-2xl
      "
    >
      {/* Background Image */}
      <Image
        src="/web.jpg"
        alt="Web Banner"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-8 py-6 flex items-center justify-between z-10 text-black">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handle("Home")}>
          <div className="w-9 h-9 rounded-xl bg-white/30 flex items-center justify-center">
            ⚡
          </div>
          <span className="font-semibold text-lg">YourBrand</span>
        </div>

        {/* Menu */}
        <div className="hidden md:flex gap-6  font-bold  position-fixed">
          {["Home", "Our Products", "Pricing", "About", "Emp", "Contact", "Mail"].map(
            (item) => (
              <button
                key={item}
                onClick={() => handle(item)}
                className="hover:text-blue-300 transition"
              >
                {item}
              </button>
            )
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <button className="text-sm hover:text-blue-300" onClick={logout}>Loge out</button>
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium">
            Sign Up
          </button>
        </div>
      </nav>
    </div>
     <div className="flex w-full gap-4 p-4">
      <Card
      title="All"
      onClick={() => handleClick("All")}
      />
       <Card
      title="deleted"
      onClick={() => handleClick("deleted")}
      />
       <Card
      title="Restored"
      onClick={() => handleClick("Restored")}
      />
     </div>
    </>
  );
};

export default Home;
