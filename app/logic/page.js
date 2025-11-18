"use client"
import React from 'react'

const page = () => {
    const [form, setForm] = React.useState({
        email: "",
        password: ""
    })
    const handleValues = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", form);
    }
  return (
   <form onSubmit={handleSubmit}>
    <label htmlFor="name">email:</label>
    <input type="email" id="email" name="email" required onChange={handleValues} />
    <label htmlFor="password">Password:</label>
    <input type="password" id="password" name="password" required onChange={handleValues}/>
    <button type="submit">Login</button>
   </form>
  )
}

export default page
