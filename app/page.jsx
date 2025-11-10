"use client"
import React, { useState } from 'react'

const page = () => {
  const [form, setForm]=useState({
    name:"",
    email:"",
    role:"",
    passWord:"",
    image:null

  });

  const handelValues=(e)=>{
    const {name,type,value,files} =e.target
    setForm({...form, [name]: type === 'file'?files:value})

  }
  const handleSubmit=( e)=>{
    e.preventDefault();
    console.log(form)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label className='text-red-700'>NAME</label>
      <input  type='text'name='name' value={form.name} placeholder='Enter Your Name' onChange={handelValues} />
       <label>Email</label>
      <input type='email' name='email' value={form.email} placeholder='Enter Your Email' onChange={handelValues} />
       <label>Role</label>
      <input type='text' name='role' value={form.role} placeholder='Enter Your Role'onChange={handelValues} />
       <label>Password</label>
      <input  type='password'name='passWord' value={form.passWord} placeholder='Enter Your Password'onChange={handelValues} />
      <label>Upload Image</label>
      <input type='file' name='image'  placeholder='Enter Your Password'onChange={handelValues} />
      <button type='submit'>Submit</button>
      </form>
  )
}

export default page
