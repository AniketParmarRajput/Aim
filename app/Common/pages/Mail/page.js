// "use client"
// import React, { useState } from 'react';

// const Page = () => {
//   const [data,setdata]= useState({
//     name:"",
//     email:"",
//     timezone:"",
//     message:""
//   })
//   const handlesubmit=(e)=>{
// e.preventDefault();
// console.log(data)
//   }
//   return (
//    <>
//    <form onSubmit={handlesubmit}>
//     <div>
//       <input required  type="text"placeholder='name' value={data.name} onChange={(e) =>setdata({...data,name:e.target.value})}/>
//       <input required type='email' placeholder='email' value={data.email}onChange={(e) =>setdata({...data, email:e.target.value})}/>
//       <input required type="datetime-local" placeholder='time and date' value={data.timezone}onChange={(e) =>setdata({...data,timezone:e.target.value})}/>
//       <textarea required placeholder='message' type='text' value={data.message}onChange={(e) =>setdata({...data,message:e.target.value})} />
//      <button required  type='submit'>submit</button>
//     </div>

//    </form>
//    </>
//   );
// }

// export default Page;


import React from 'react'

const page = () => {
  const company = {
    name: "TechSoft",
    founded: 2015,

    employees: [
      {
        id: 1,
        name: "Rahul",
        age:"24",
        role: "Developer",
        skills: ["JavaScript", "React", "Node.js"],
        address: {
          city: "Delhi",
          country: "India"
        }
      },
      {
        id: 2,
        name: "Anita",
        age:20,
        role: "Designer",
        skills: ["Figma", "Photoshop"],
        address: {
          city: "Mumbai",
          country: "India"
        }
      }
    ],

    offices: {
      india: {
        cities: ["Delhi", "Mumbai", "Bangalore"]
      },
      usa: {
        cities: ["New York", "San Francisco"]
      }
    }
  };

  return (
    <div>
      {company?.employees.filter(items =>items.age>20).map((item, index) => (
        <div key={index}>
          {JSON.stringify(item, null, 2).split(":")}
        </div>
      ))}
    </div>
  )
}

export default page




