"use client";
import React, { useEffect, useState } from "react";
import ServerTable from "@/app/Components/Resuable/ServerTable";

const Page = () => {
    const [employees, setEmployees] = useState([]);

    // ✅ Table States (Required for MRT)
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState([]);

    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "email", header: "Email" },

        {
            header: "Action",
            accessorKey: "action",
            Cell: ({ row }) => {
                const id = row.original.id;

                return (
                    <button
                        onClick={() => handledelete(deleteId)}
                        style={{
                            background: "red",
                            color: "white",
                            padding: "5px 10px",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        Delete
                    </button>
                );
            },
        }

    ];


    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/employees/get", {
                    method: "GET",
                    credentials: "include",
                });

                const result = await response.json();
                console.log("data:", result);

                // ✅ If API returns direct array
                if (Array.isArray(result)) {
                    setEmployees(result);
                }
                // ✅ If API returns { data: [...] }
                else if (Array.isArray(result?.data)) {
                    setEmployees(result.data);
                } else {
                    setEmployees([]);
                    console.warn("API response is not an array:", result);
                }
            } catch (err) {
                console.error("Error fetching employees:", err);
            }
        };

        fetchEmployees();
    }, []);

    // const handledelete = async (deletedid) => {
    //     console.log("Deleting employee with ID:", deletedid);

    //     try {
    //         const response = await fetch(
    //             `http://localhost:5000/api/employees/delete/${deletedid}`,
    //             {
    //                 method: "DELETE",
    //             }
    //         );

    //         // ✅ Check response type
    //         const text = await response.json();
    //         console.log("Raw Response:", text);

    //         // ✅ Convert to JSON safely
    //         let result;
    //         try {
    //             result = JSON.parse();
    //         } catch (e) {
    //             console.error("Server JSON nahi bhej raha, HTML aa raha hai!");
    //             return;
    //         }

    //         console.log("Delete response:", result);
    //     } catch (err) {
    //         console.error("Error deleting employee:", err);
    //     }
    // };
const handledelete = async (id) => {
  console.log("Deleting employee with ID:", id);

  try {
    const response = await fetch(
      `http://localhost:5000/api/employees/delete/${id}`,
      { method: "DELETE" }
    );

    const result = await response.json(); // ✅ only this

    console.log("Delete response:", result);

    if (response.ok) {
      alert(result.message);
      setEmployees((prev) => prev.filter((emp) => emp.id !== deletedid));
    } else {
      alert(result.message || "Delete failed ❌");
    }
  } catch (err) {
    console.error("Error deleting employee:", err);
  }
};



    return (
        <div>
            <div className="flex justify-center">Employes Details</div>
            <ServerTable
                data={employees}
                columns={columns}
                isLoading={false}
                isError={false}
                isRefetching={false}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                meta={{ totalRowCount: employees.length }}
            />
        </div>
    );
};

export default Page;

