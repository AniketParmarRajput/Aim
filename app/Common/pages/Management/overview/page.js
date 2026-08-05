"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../../../Context/AuthContext";
import PageHero from "@/app/Components/Reusable/PageHero";
import { LineChart } from "@mui/x-charts/LineChart";

const lineColors = { revenue: "#c2703d", orders: "#8b5e3c", pending: "#ca8a04", delivered: "#16a34a" };

const OverviewPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  const fetchData = async () => {
    try {
      const oRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/all`);
      const o = await oRes.json();
      if (o.success) setOrders(o.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    setLoading(true);
    fetchData();
  }, [user]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + Number(o.price || 0) * Number(o.quantity || 1), 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const customers = new Set(orders.map((o) => o.email).filter(Boolean)).size;
    return { totalRevenue, pending, customers };
  }, [orders]);

  const monthlySeries = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      const d = o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 7) : "unknown";
      if (!map.has(d)) map.set(d, { revenue: 0, orders: 0 });
      const entry = map.get(d);
      entry.revenue += Number(o.price || 0) * Number(o.quantity || 1);
      entry.orders += 1;
    });
    const sorted = [...map.entries()]
      .filter(([d]) => d !== "unknown")
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .slice(-12);
    return {
      labels: sorted.map(([d]) => new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" })),
      revenue: sorted.map(([, v]) => Math.round(v.revenue)),
      orders: sorted.map(([, v]) => v.orders),
    };
  }, [orders]);

  const statusTrend = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      const d = o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "unknown";
      if (!map.has(d)) map.set(d, { pending: 0, delivered: 0 });
      const entry = map.get(d);
      if (o.status === "pending") entry.pending += 1;
      if (o.status === "delivered") entry.delivered += 1;
    });
    const sorted = [...map.entries()]
      .filter(([d]) => d !== "unknown")
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .slice(-12);
    return {
      labels: sorted.map(([d]) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })),
      pending: sorted.map(([, v]) => v.pending),
      delivered: sorted.map(([, v]) => v.delivered),
    };
  }, [orders]);

  const topProductTrend = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      const name = o.itemName || "Unknown";
      const d = o.createdAt ? new Date(o.createdAt).toISOString().slice(0, 10) : "unknown";
      const key = `${name}::${d}`;
      if (!map.has(key)) map.set(key, { name, d, value: 0 });
      map.get(key).value += Number(o.price || 0) * Number(o.quantity || 1);
    });
    const byName = new Map();
    [...map.values()].forEach(({ name, value }) => {
      byName.set(name, (byName.get(name) || 0) + value);
    });
    const top = [...byName.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name]) => name);
    const daily = new Map();
    [...map.values()].forEach(({ name, d, value }) => {
      if (!top.includes(name)) return;
      const label = new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      if (!daily.has(label)) {
        const row = { label };
        top.forEach((t) => (row[t] = 0));
        daily.set(label, row);
      }
      daily.get(label)[name] += value;
    });
    const sortedLabels = [...daily.keys()].sort((a, b) => {
      const fa = new Date(a + " " + new Date().getFullYear()).getTime();
      const fb = new Date(b + " " + new Date().getFullYear()).getTime();
      return fa - fb;
    });
    const labels = sortedLabels.slice(-10);
    const series = top.slice(0, 3).map((name) => ({
      label: name,
      data: labels.map((l) => Math.round((daily.get(l) && daily.get(l)[name]) || 0)),
    }));
    return { labels, series };
  }, [orders]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center animate-fade-in max-w-md">
          <span className="text-6xl">🚫</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Access Denied</h1>
          <p className="text-sm text-gray-400 mt-2">You do not have admin privileges to access this overview.</p>
          <button onClick={() => router.push("/Common/pages/home")} className="mt-6 bg-brand-orange text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-orange-hover transition-all">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <PageHero
        badge="📈 Overview"
        title="Business Overview"
        titleGradient="At a Glance"
        subtitle="Visualize revenue, orders, and product performance with interactive line graphs."
        showExplore={false}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/Common/pages/Management")} className="flex items-center gap-2 text-[13px] font-medium text-gray-600 bg-brand-light border border-gray-200 px-4 py-2.5 rounded-xl hover:border-brand-orange hover:text-brand-orange transition-all">
            <ArrowLeftIcon size={14} /> Back to Admin Panel
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading overview...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: "💰", color: "from-brand-orange to-orange-500" },
                { label: "Total Orders", value: orders.length, icon: "📦", color: "from-green-500 to-green-600" },
                { label: "Pending Orders", value: stats.pending, icon: "⏳", color: "from-yellow-500 to-yellow-600" },
                { label: "Customers", value: stats.customers, icon: "👤", color: "from-blue-500 to-blue-600" },
              ].map((s) => (
                <div key={s.label} className="bg-brand-light border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center opacity-20`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Revenue line graph */}
            <div className="bg-brand-light border border-gray-100 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Revenue &amp; Orders — Monthly Review</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Month-by-month line graph</p>
                </div>
              </div>
              {monthlySeries.labels.length === 0 ? (
                <p className="text-xs text-gray-400 py-16 text-center">No orders yet to chart.</p>
              ) : (
                <LineChart
                  xAxis={[{ scaleType: "point", data: monthlySeries.labels, tickLabelStyle: { fontSize: 10 } }]}
                  series={[
                    { id: "revenue", label: "Revenue (₹)", data: monthlySeries.revenue, color: lineColors.revenue, curve: "monotone", area: true, valueFormatter: (v) => (v == null ? "" : `₹${v.toLocaleString("en-IN")}`) },
                    { id: "orders", label: "Orders", data: monthlySeries.orders, color: lineColors.orders, curve: "monotone", valueFormatter: (v) => (v == null ? "" : `${v}`) },
                  ]}
                  height={300}
                  margin={{ left: 60, right: 20, top: 20, bottom: 30 }}
                  sx={{ "& .MuiLineElement-root": { strokeWidth: 2 }, "& .MuiAreaElement-root": { opacity: 0.12 } }}
                />
              )}
            </div>

            {/* Status trend line */}
            <div className="bg-brand-light border border-gray-100 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Order Status Trend</h3>
              {statusTrend.labels.length === 0 ? (
                <p className="text-xs text-gray-400 py-16 text-center">No orders yet to chart.</p>
              ) : (
                <LineChart
                  xAxis={[{ scaleType: "point", data: statusTrend.labels, tickLabelStyle: { fontSize: 10 } }]}
                  series={[
                    { id: "pending", label: "Pending", data: statusTrend.pending, color: lineColors.pending, curve: "monotone" },
                    { id: "delivered", label: "Delivered", data: statusTrend.delivered, color: lineColors.delivered, curve: "monotone" },
                  ]}
                  height={280}
                  margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                  sx={{ "& .MuiLineElement-root": { strokeWidth: 2 } }}
                />
              )}
            </div>

            {/* Top products line graph */}
            <div className="bg-brand-light border border-gray-100 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Top Products Revenue Trend</h3>
              {topProductTrend.series.length === 0 ? (
                <p className="text-xs text-gray-400 py-16 text-center">No orders yet to chart.</p>
              ) : (
                <LineChart
                  xAxis={[{ scaleType: "point", data: topProductTrend.labels, tickLabelStyle: { fontSize: 10 } }]}
                  series={topProductTrend.series.map((s, i) => ({ ...s, curve: "monotone", color: ["#8b5e3c", "#c2703d", "#d9a066"][i] }))}
                  height={300}
                  margin={{ left: 60, right: 20, top: 20, bottom: 30 }}
                  sx={{ "& .MuiLineElement-root": { strokeWidth: 2 } }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;