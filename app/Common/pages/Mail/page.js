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




