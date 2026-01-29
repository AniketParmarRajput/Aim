"use client";
import Products from "@/app/Components/Resuable/ProductCards";
import React from "react";
import { useRouter } from "next/navigation";


const Product = () => {
  const tittle = ["menu1", "menu2", "menu3", "menu4"];
  const handlecard = (item) => {
    alert(item);
  };
  const handleProductAction = (actionType, type) => {
    if (actionType === "addToCart") {
      console.log(type);
      alert("Adding to cart: " + type);
    } else {
      alert("Buying now:" + type);
      // your buy-now logic
    }
  };
  const router = useRouter();
    const handleRoutes = (item) => {
    console.log("by route", item);
    router.push(`/Common/pages/Products${item}`);
  };

  return (
    <div className="m-5">
      <h1 className="flex justify-center font-bold">Products List</h1>
      <div className="flex gap-5 p-7">
        {tittle.map((item, index) => (
          <Products
            key={index}
            title={item}
            onClick={() => handlecard(item)}
            handleAction={handleProductAction}
            onClick1={() =>handleRoutes(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default Product;



