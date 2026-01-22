"use client"
import React, { useState } from 'react';

const Page = () => {
  const[data,setdate]=useState("hello")
  const handleit=()=>{
    setdate(prev =>(prev?"":"hello"))
  }
  return (
    <div>
     <button 
     onClick={handleit}>{data?"hide":"show"}</button>
     <br/>
     {data}
    </div>
  );
}

export default Page;
