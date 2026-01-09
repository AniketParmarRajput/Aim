"use client";

import React, { useState } from "react";
import Card from "@/app/Components/Resuable/Card";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Home = () => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

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

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    //   {/* ================= HEADER ================= */}
    //   <header className="relative text-white overflow-hidden">
    //       <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
    //         <Image
    //           src="/web.jpg"
    //           alt="Web Banner"
    //           fill
    //           className="object-cover"
    //           priority
    //         />
    //       </div>
    //     <div className="container mx-auto px-6 py-12 relative z-10">
    //       {/* NAVBAR */}
    //       {/* <nav className="flex justify-between items-center mb-12">
    //         <div className="flex items-center space-x-2">
    //           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
    //             <span className="text-blue-600 font-bold">⚡</span>
    //           </div>
    //           <span className="text-xl font-bold">YourBrand</span>
    //         </div>

    //         <div className="hidden md:flex space-x-6">
    //           {["Home", "Our Products", "Pricing", "About", "Emp", "Contact", "Mail"].map(
    //             (item) => (
    //               <button
    //                 key={item}
    //                 onClick={() => handle(item)}
    //                 className="hover:text-blue-200 transition"
    //               >
    //                 {item}
    //               </button>
    //             )
    //           )}
    //         </div>

    //         <div className="space-x-3">
    //           <button className="text-sm hover:text-blue-200">Login</button>
    //           <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium">
    //             Sign Up
    //           </button>
    //         </div>
    //       </nav> */}

    //       {/* HERO IMAGE */}
    //       {/* <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
    //         <Image
    //           src="/web.jpg"
    //           alt="Web Banner"
    //           fill
    //           className="object-cover"
    //           priority
    //         />
    //       </div> */}
    //     </div>

    //     {/* WAVE DIVIDER */}
    //     <svg
    //       className="absolute bottom-0 left-0 w-full"
    //       viewBox="0 0 1440 90"
    //       preserveAspectRatio="none"
    //     >
    //       <path
    //         fill="#f8fafc"
    //         d="M0,40 C120,70 360,0 720,30 1080,60 1320,20 1440,10 L1440,90 L0,90 Z"
    //       />
    //     </svg>
    //   </header>

    //   {/* ================= MAIN ================= */}
    //   <main className="container mx-auto px-6 py-20 -mt-10 relative z-10">
    //     <div className="text-center mb-14">
    //       <h2 className="text-4xl font-bold text-gray-800 mb-4">
    //         Our Amazing Features
    //       </h2>
    //       <p className="text-gray-600 max-w-2xl mx-auto">
    //         Explore powerful features crafted to boost your productivity.
    //       </p>
    //     </div>

    //     <Card handleCards={handleCardClick} />
    //   </main>

    //   {/* ================= MODAL ================= */}
    //   {selectedItem && (
    //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    //       <div className="bg-white rounded-xl p-6 w-full max-w-md">
    //         <div className="flex justify-between mb-4">
    //           <h3 className="font-bold text-lg">{selectedItem.title}</h3>
    //           <button onClick={handleCloseModal}>✕</button>
    //         </div>
    //         <p className="text-gray-600 mb-6">
    //           You selected <b>{selectedItem.title}</b>
    //         </p>
    //         <div className="flex justify-end gap-3">
    //           <button
    //             onClick={handleCloseModal}
    //             className="px-4 py-2 border rounded"
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             onClick={handleCloseModal}
    //             className="px-4 py-2 bg-blue-600 text-white rounded"
    //           >
    //             Continue
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <>
<div className="relative w-full h-[520px] md:h-[420px] rounded-2xl  shadow-2xl ">
 <div>
  <nav className="flex justify-between items-center mb-12">
    {/* Logo */}
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center">
        <span className="text-blue-600 font-bold">⚡</span>
      </div>
      <span className="text-xl font-bold">YourBrand</span>
    </div>

    {/* Menu */}
    <div className="hidden md:flex space-x-6">
      {["Home", "Our Products", "Pricing", "About", "Emp", "Contact", "Mail"].map(
        (item) => (
          <button
            key={item}
            onClick={() => handle(item)}
            className="hover:text-blue-200 transition"
          >
            {item}
          </button>
        )
      )}
    </div>

    {/* Auth buttons */}
    <div className="space-x-3">
      <button className="text-sm hover:text-blue-200">Login</button>
      <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium">
        Sign Up
      </button>
    </div>
  </nav>
</div>

  <div className="relative w-full h-full  rounded-2xl object-fit">
   <Image
  src="/web.jpg"
  alt="Web Banner"
  fill
  priority
  sizes="(max-width: 768px) 100vw, 1200px"
  className="object-contain"
/>
  </div>
</div>



    </>
  );
};

export default Home;
