"use client";
import React, { useState } from "react";
import Card from "@/app/Components/Resuable/Card";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  // FIXED: This function must be inside component and without extra closing brace
  const handle = (item) => {
    switch (item) {
      case "Home":
        router.push("/");
        break;
      case "Our Products":
        router.push("/Common/pages/Products");
        break;
      case "Pricing":
        router.push("/Common/pages/Pricing");
        break;
      case "About":
        router.push("/Common/pages/About");
        break;
      case "Emp": // Capitalized, optional
        router.push("/Common/pages/Employes"); // Corrected spelling
        break;
      case "Contact":
        router.push("/Common/pages/Contact");
        break;
         case "demo":
        router.push("/Common/pages/demo");
        break;
      default:
        break;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-16">
          {/* Navigation Bar */}
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">⚡</span>
              </div>
              <span className="text-xl font-bold">YourBrand</span>
            </div>

            {/* FIXED NAVIGATION */}
            <div className="hidden md:flex space-x-8">
              {["Home", "Our Products", "Pricing", "About", "Emp", "Contact","demo"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => handle(item)}
                    className="hover:text-blue-200 transition-colors duration-300 font-medium"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-white hover:text-blue-200 transition-colors duration-300">
                Login
              </button>
              <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300 shadow-lg">
                Sign Up
              </button>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              New features available now
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Digital Experience
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              Discover powerful tools and features designed to elevate your
              productivity. Join thousands of satisfied users worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                Get Started Free
              </button>
              <button className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 text-slate-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28..."
              opacity=".25"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86..."
              opacity=".5"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32..."
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 -mt-8 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Amazing Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our carefully crafted features designed to help you achieve
            more.
          </p>
        </div>

        <Card handleCards={handleCardClick} />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
        {/* ... footer unchanged ... */}
      </footer>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedItem.title}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              You selected:{" "}
              <span className="font-semibold text-blue-600">
                {selectedItem.title}
              </span>
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
