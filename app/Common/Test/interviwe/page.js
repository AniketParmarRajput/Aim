"use client"
// import React, { useEffect, useRef } from 'react';

// const Page = () => {
//   const inputref = useRef(null);
//  useEffect(() =>{
//   inputref.current.focus();
//  },[])
//   return (
//     <div>
      
//       <input ref={inputref} placeholder='enter name'/>
//     </div>
//   );
// }

// export default Page;
import React from "react";

export default function Page() {
  return React.createElement(
    "div",
    { style: { border: "2px solid red", padding: "10px" } },
    React.createElement("h1", null, "Hello"),
    React.createElement("p", null, "Welcome to React")
  );
}

