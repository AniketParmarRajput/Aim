"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/prizing/getPrizing/${id}`
        );

        const result = await response.json();

        console.log("Product details:", result);

        setProduct(result);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold animate-pulse">
          Loading Product...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] p-5">
      
      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        
        {/* Left Side Image */}
        <div className="flex flex-col items-center">

          {/* Buttons */}
          <div className="flex gap-4 mt-6 w-full">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 w-1/2 rounded">
              ADD TO CART
            </button>

            <button className="bg-[#fb641b] hover:bg-[#e85a16] text-white font-semibold py-3 w-1/2 rounded">
              BUY NOW
            </button>
          </div>
        </div>

        {/* Right Side Details */}
        <div>
          
          <h1 className="text-2xl font-semibold text-gray-800">
            {product.data?.description}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">
              4.3 ★
            </span>

            <span className="text-gray-500 text-sm">
              2,514 Ratings & 210 Reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-5">
            <h2 className="text-4xl font-bold text-gray-900">
              ₹ {product.data?.amount}
            </h2>

            <p className="text-green-600 font-semibold mt-1">
              25% off
            </p>
          </div>

          {/* Product ID */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Product ID
            </h3>

            <p className="text-gray-600 mt-1">
              {product.data?.id}
            </p>
          </div>

          {/* Description */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Description
            </h3>

            <p className="text-gray-600 leading-7 mt-2">
              {product.data?.description}
            </p>
          </div>

          {/* Offers */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Available Offers
            </h3>

            <ul className="space-y-2 text-sm text-gray-700">
              <li>✔ Bank Offer 10% off on HDFC Cards</li>
              <li>✔ Special Price Get extra 25% off</li>
              <li>✔ No Cost EMI Available</li>
              <li>✔ Free Delivery Available</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;