"use client";
import React, { useEffect, useState } from "react";
import ServerTable from "@/app/Components/Resuable/ServerTable";
import { useRouter } from "next/navigation";
import { useAuth } from "../../Context/AuthContext";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", position: "", salary: "" });
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get`, { method: "GET", credentials: "include" });
      const result = await res.json();
      if (Array.isArray(result)) setEmployees(result);
      else if (Array.isArray(result?.data)) setEmployees(result.data);
      else setEmployees([]);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get`, { method: "GET", credentials: "include" });
        const result = await res.json();
        if (cancelled) return;
        if (Array.isArray(result)) setEmployees(result);
        else if (Array.isArray(result?.data)) setEmployees(result.data);
        else setEmployees([]);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-md">
          <span className="text-6xl">🚫</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Access Denied</h1>
          <p className="text-sm text-gray-400 mt-2">Only admin users can manage employees.</p>
          <button onClick={() => router.push("/Common/pages/home")} className="mt-6 bg-brand-orange text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-hover transition-all">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (res.ok) {
        setShowForm(false);
        setForm({ name: "", email: "", mobile: "", position: "", salary: "" });
        fetchEmployees();
      } else {
        alert(result.message || "Failed to add employee");
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handledelete = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/delete/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (res.ok) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      } else {
        alert(result.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (id) => {
    router.push(`/?id=${id}`);
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "position", header: "Position" },
    { accessorKey: "salary", header: "Salary" },
    {
      header: "Action",
      accessorKey: "action",
      Cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2">
            <button onClick={() => handleEdit(id)} className="bg-brand-dark hover:opacity-90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Edit</button>
            <button onClick={() => handledelete(id)} className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">Delete</button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-light border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-400">{employees.length} total</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-brand-dark hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">+ Add Employee</button>
      </div>

      <div className="p-6">
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

      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-brand-light rounded-2xl shadow-xl z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Add Employee</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" />
              <input type="tel" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" />
              <input type="text" placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" />
              <input type="number" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-orange" />
              <button type="submit" className="w-full py-2.5 bg-brand-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors">+ Add Employee</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
