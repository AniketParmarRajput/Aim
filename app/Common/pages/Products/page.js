// "use client";
// import Products from "@/app/Components/Resuable/ProductCards";
// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";


// const Product = () => {
//   const handleCard = (item) => {
//     alert(item);
//   };
//   const handleProductAction = (actionType, type) => {
//     if (actionType === "addToCart") {
//       console.log(type);
//       alert("Adding to cart: " + type);
//     } else {
//       alert("Buying now:" + type);
//       // your buy-now logic
//     }
//   };
//   const router = useRouter();
//     const handleRoutes = (item) => {
//     alert("by route" + item.id);
//    router.push(`/Common/pages/Products/${item.id}`);

//   };
//   useEffect(() =>{
//     const fetchProducts = async () => {
//       try{
//         const response = await fetch("http://localhost:5000/api/prizing/getPrizing");
//         const data = await response.json();
//         console.log("Fetched products:", data);
//       }
//       catch(err){
//         console.error("Error fetching products:", err);
//       }
//     };
//     fetchProducts();
//   }, []);
 

//   return (
//     <div className="m-5">
//       <h1 className="flex justify-center font-bold">Products List</h1>
//       <div className="flex gap-5 p-7">
//         {data.map((item, index) => (
//           <Products
//             key={index}
//             title2={item}
//             onClick={() => handleCard(item)}
//             handleAction={handleProductAction}
//             onClick1={() =>handleRoutes(item)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Product;

"use client";
import Products from "@/app/Components/Resuable/ProductCards";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Product = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  const handleCard = (item) => {
    alert(item);
  };

  const handleProductAction = (actionType, type) => {
    if (actionType === "addToCart") {
      alert("Adding to cart: " + type);
    } else {
      alert("Buying now: " + type);
    }
  };

  const handleRoutes = (item) => {
    router.push(`/Common/pages/Products/${item.id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/prizing/getPrizing");
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="m-5">
      <h1 className="flex justify-center font-bold">Products List</h1>

      <div className="flex gap-5 p-7">
        {data.map((item) => (
          <Products
            key={item.id}
            title2={item.name}
            onClick={() => handleCard(item)}
            handleAction={handleProductAction}
            onClick1={() => handleRoutes(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default Product;

