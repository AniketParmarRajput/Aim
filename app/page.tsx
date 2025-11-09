import React, { useState } from 'react'

const page = () => {
  const [form, setForm]=useState('');
  return (
    <div>
      <label>name</label>
      <input placeholder='enter the name'/>
      <label>age</label>
      <input placeholder='enter the age'/>
    </div>
  )
}

export default page
