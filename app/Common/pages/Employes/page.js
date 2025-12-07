"use client"
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/employees/get");
                const data = await response.json();
                console.log("data:", data);
                setEmployees(data); // or data.data if backend sends { data: [...] }
            } catch (err) {
                console.error("Error fetching employees:", err);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div className='text-red-500'>
            <h1>Employees</h1>
            <pre>{JSON.stringify(employees, null, 2)}</pre>
              <h1>Employees</h1>
           
        </div>
    )
}

export default Page;
