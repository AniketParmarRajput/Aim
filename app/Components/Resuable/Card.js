"use client"
import React from "react";

const Card = ({ handleCards }) => {
  const cards = [
    { 
      title: "Creative Solutions", 
      des: "Innovative approaches to solve complex problems with ease and efficiency.",
      icon: "💡",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Premium Features", 
      des: "Access exclusive features that enhance your productivity and workflow.",
      icon: "⭐",
      color: "from-purple-500 to-pink-500"
    },
    { 
      title: "Dynamic Tools", 
      des: "Adaptive tools that grow with your needs and requirements.",
      icon: "⚡",
      color: "from-orange-500 to-red-500"
    },
    { 
      title: "Secure Platform", 
      des: "Enterprise-grade security to keep your data safe and protected.",
      icon: "🛡️",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="w-full p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((item, index) => (
          <div
            key={index}
            className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105"
            onClick={() => handleCards(item)}
          >
            {/* Background Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
            
            {/* Main Card */}
            <div className="relative bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group-hover:shadow-2xl transition-all duration-300">
              {/* Gradient Top Bar */}
              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
              
              {/* Card Content */}
              <div className="p-6">
                {/* Icon */}
                <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                  {item.title}
                </h2>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {item.des}
                </p>
                
                {/* Click Indicator */}
                <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  <span>Learn more</span>
                  <svg 
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;

