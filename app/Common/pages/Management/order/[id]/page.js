"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "@/app/Common/Context/AuthContext";
 import {downloadOrderBill} from "@/app/Common/pages/Orders/bill";

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-sky-50 text-sky-700 border-sky-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const InfoItem = ({ label, value }) => (
  <div className="bg-brand-cream rounded-xl px-4 py-3">
    <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
    <p className="text-[13.5px] font-semibold text-gray-900 break-words">{value || "—"}</p>
  </div>
);

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isAdmin = user?.role === "admin";

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/${id}`);
      const result = await res.json();
      if (result.success) setOrder(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (order?.userId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get/${order.userId}`)
        .then((r) => r.json())
        .then((res) => { if (res.success) setCustomer(res.data); })
        .catch(() => {});
    }
  }, [order?.userId]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const image = order?.image
    ? (() => { const u = Array.isArray(order.image) ? order.image[0] : order.image; return u?.startsWith("http") ? u : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${u}`; })()
    : null;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-6xl">🚫</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Access Denied</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <span className="text-6xl">📦</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Order not found</h1>
          <button onClick={() => router.push("/Common/pages/Management")} className="mt-6 bg-brand-orange text-white text-[13px] font-semibold px-6 py-2.5 rounded-xl transition-all">
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = Number(order.price);

  const unitPrice = Math.round(Number(order.price) / Math.max(1, Number(order.quantity || 1)));

  const handleDownloadBill = async () => {
    try {
      let customerName = "";
      if (order.userId) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get/${order.userId}`);
        const result = await res.json();
        if (result.success && result.data?.name) customerName = result.data.name;
      }
      await downloadOrderBill(order, customerName);
    } catch (err) {
      console.error("Error downloading bill:", err);
      alert("Could not download the bill. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-600 bg-brand-light border border-gray-200 px-4 py-2.5 rounded-xl hover:border-brand-orange hover:text-brand-orange transition-all">
            <ArrowLeftIcon size={14} /> Back
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadBill} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-green-700 bg-green-50 border border-green-600 px-4 py-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-all">
              🧾 Download Bill
            </button>
            <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border capitalize ${statusColors[order.status] || "bg-brand-cream text-gray-600 border-gray-200"}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shadow-md">
            <span className="text-white text-lg">📦</span>
          </div>
          <div>
            <h1 className="text-[19px] font-bold text-gray-900">Order #{order.id}</h1>
            <p className="text-[12px] text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</p>
          </div>
        </div>

        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
            {/* Image side */}
            <div className="flex flex-col items-center justify-center gap-4 p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-brand-cream/50">
              <div className="w-full aspect-square max-w-[240px] rounded-2xl border border-gray-200 bg-brand-light flex items-center justify-center overflow-hidden shadow-sm">
                {image ? <img src={image} alt={order.itemName} className="w-full h-full object-cover" /> : <span className="text-6xl">📦</span>}
              </div>
              <h3 className="text-center text-[15px] font-bold text-gray-900">{order.itemName}</h3>
              <span className="text-[12px] text-gray-400 font-mono">SKU: {order.sku || "—"}</span>
            </div>

            {/* Details side */}
            <div className="p-6 md:p-8">
              <h2 className="text-[15px] font-bold text-gray-900 mb-4">Order Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoItem label="Item Name" value={order.itemName} />
                <InfoItem label="SKU" value={order.sku} />
                <InfoItem label="Unit Price" value={`₹${unitPrice.toLocaleString("en-IN")}`} />
                <InfoItem label="Quantity" value={order.quantity ?? 1} />
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 sm:col-span-2">
                  <p className="text-[11px] text-orange-500 mb-0.5">Total Amount</p>
                  <p className="text-[18px] font-bold text-brand-orange">₹{totalAmount.toLocaleString("en-IN")}</p>
                </div>
                <InfoItem label="Customer" value={customer?.name || "—"} />
                <InfoItem label="Customer Email" value={customer?.email || order.email} />
                <InfoItem label="Payment Method" value={order.paymentMethod?.toUpperCase()} />
                <InfoItem label="Delivery" value={order.deliveryDate} />
                <InfoItem label="Mobile" value={order.mobile} />
                <InfoItem label="Status" value={order.status?.toUpperCase()} />
                <InfoItem label="Cancel Reason" value={order.cancelReason} />
              </div>

              {(order.address || order.state || order.district || order.pincode) && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.address && <InfoItem label="Address" value={order.address} />}
                    {order.state && <InfoItem label="State" value={order.state} />}
                    {order.district && <InfoItem label="District" value={order.district} />}
                    {order.pincode && <InfoItem label="Pincode" value={order.pincode} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}