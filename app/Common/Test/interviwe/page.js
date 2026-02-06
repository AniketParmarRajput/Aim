"use client"
import React, { useEffect, useRef } from 'react';

const Page = () => {
  const inputref = useRef(null);
 useEffect(() =>{
  inputref.current.focus();
 },[])
  return (
    <div>
      
      <input ref={inputref} placeholder='enter name'/>
    </div>
  );
}

export default Page;


