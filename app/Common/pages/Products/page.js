"use client";
import Products from "@/app/Components/Resuable/ProductCards";
import React from "react";
import { useRouter } from "next/navigation";


const Product = () => {
  const tittle = ["menu1", "menu2", "menu3", "menu4"];
  const title2 =[{id:"1", name:"menu1"},
    {id:"2", name:"menu2"},
    {id:"3", name:"menu3"},
    {id:"4", name:"menu4"},
  ]
  const handleCard = (item) => {
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
    alert("by route" + item.id);
   router.push(`/Common/pages/Products/${item.id}`);

  };

  return (
    <div className="m-5">
      <h1 className="flex justify-center font-bold">Products List</h1>
      <div className="flex gap-5 p-7">
        {title2.map((item, index) => (
          <Products
            key={index}
            title2={item}
            onClick={() => handleCard(item)}
            handleAction={handleProductAction}
            onClick1={() =>handleRoutes(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default Product;



