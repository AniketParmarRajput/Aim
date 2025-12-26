"use client"
import React, { useState } from "react";

export default function Page() {
  const [data, setData] = useState({
    itemName: "",
    amount: "",
    description: "",
    image: null,
  });
  const handleSubmit = async(e)=>{
    e.preventDefault();
     const formData = new FormData();
     formData.append("itemName", data.itemName);
     formData.append("amount", data.amount);
     formData.append("description", data.description);
     formData.append("image", data.image);

     const res =await fetch("http://localhost:5000/api/prizing/addPrizing",{
      method:"POST",
      body:formData,
     });
     
     setData({
       itemName: "",
    amount: "",
    description: "",
    image: null,
     })
     const files= document.querySelector('input[type="file"]')
    if (files) {
          files.value = "";
        }
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Pricing Page
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              value={data.itemName}
              placeholder="Enter item name"
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setData({...data, itemName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={data.amount}
              placeholder="Enter amount"
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              onChange={(e)=>setData({...data, amount:e.target.value})}
            />
          </div>
             <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              description
            </label>
            <input
              type="string"
              name="description"
              value={data.description}
              placeholder="Enter description"
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              onChange={(e)=>setData({...data, description:e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={(e) =>
                setData({ ...data, image: e.target.files[0] })
              }
              // value={data.image ? data.image.name : ""}
              className="w-full rounded-lg border border-gray-300 p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}




