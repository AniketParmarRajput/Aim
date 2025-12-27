"use client"
import React, { useState } from 'react';

const Page = () => {
  const [data,setdata]= useState({
    name:"",
    email:"",
    timezone:"",
    message:""
  })
  const handlesubmit=(e)=>{
e.preventDefault();
console.log(data)
  }
  return (
   <>
   <form onSubmit={handlesubmit}>
    <div>
      <input required  type="text"placeholder='name' value={data.name} onChange={(e) =>setdata({...data,name:e.target.value})}/>
      <input required type='email' placeholder='email' value={data.email}onChange={(e) =>setdata({...data, email:e.target.value})}/>
      <input required type="datetime-local" placeholder='time and date' value={data.timezone}onChange={(e) =>setdata({...data,timezone:e.target.value})}/>
      <textarea required placeholder='message' type='text' value={data.message}onChange={(e) =>setdata({...data,message:e.target.value})} />
     <button required  type='submit'>submit</button>
    </div>

   </form>
   </>
  );
}

export default Page;






