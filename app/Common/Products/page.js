import React from "react";

const Page = () => {
  const products = [
    {
      title: "Smart AI Assistant",
      description: "Automate workflows and boost productivity.",
      icon: "🤖",
    },
    {
      title: "Cloud Storage Pro",
      description: "Fast, secure, unlimited cloud storage.",
      icon: "☁️",
    },
    {
      title: "Analytics Dashboard",
      description: "Track insights with real-time analytics.",
      icon: "📊",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Our Products
      </h1>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {item.title}
            </h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;

