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

