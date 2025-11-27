"use client"
import React, { useState } from "react";
import Card from "@/app/Components/Resuable/Card";

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
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
            
            <div className="hidden md:flex space-x-8">
              {['Home', 'Features', 'Pricing', 'About', 'Contact'].map((item) => (
                <a key={item} href="#" className="hover:text-blue-200 transition-colors duration-300 font-medium">
                  {item}
                </a>
              ))}
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
              Discover powerful tools and features designed to elevate your productivity. 
              Join thousands of satisfied users worldwide.
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
          <svg className="w-full h-12 text-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
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
            Explore our carefully crafted features designed to help you achieve more. 
            Each tool is built with precision and user experience in mind.
          </p>
        </div>
        
        <Card handleCards={handleCardClick} />
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">⚡</span>
                </div>
                <span className="text-2xl font-bold">YourBrand</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Building the future of digital innovation. We create tools that empower 
                businesses and individuals to achieve their full potential.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'github', 'linkedin', 'facebook'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                    <span className="text-lg">📱</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Product</h3>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'Case Studies', 'Reviews', 'Updates'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Support</h3>
              <ul className="space-y-4">
                {['Help Center', 'Community', 'Learning', 'Academy', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 YourBrand. All rights reserved.
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
                  <a key={item} href="#" className="hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Selected Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedItem.title}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              You selected: <span className="font-semibold text-blue-600">{selectedItem.title}</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
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
