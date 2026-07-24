"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/Common/pages/login"); return; }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/order/by-email/${user.email}`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data.length > 0) {
            setProfile(result.data[0]);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, router]);

  const displayName = profile?.customerName || user?.name || "User";
  const displayEmail = user?.email || "—";
  const displayMobile = profile?.mobile || user?.mobile || "—";

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center text-white text-2xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
              <p className="text-sm text-gray-400">{user?.role === "admin" ? "Administrator" : "Customer"}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-5" />

          <div className="space-y-4">
            <div>
              <label className="text-[12px] text-gray-400 font-medium">Full Name</label>
              <p className="text-[15px] font-semibold text-gray-900">{displayName}</p>
            </div>
            <div>
              <label className="text-[12px] text-gray-400 font-medium">Email Address</label>
              <p className="text-[15px] font-semibold text-gray-900">{displayEmail}</p>
            </div>
            <div>
              <label className="text-[12px] text-gray-400 font-medium">Mobile Number</label>
              <p className="text-[15px] font-semibold text-gray-900">{displayMobile}</p>
            </div>
            <div>
              <label className="text-[12px] text-gray-400 font-medium">Role</label>
              <p className="text-[15px] font-semibold text-gray-900 capitalize">{user?.role || "customer"}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-5" />

          <button onClick={() => router.push("/Common/pages/home")} className="w-full py-2.5 bg-brand-dark text-white rounded-xl text-[14px] font-bold hover:opacity-90 transition-all">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
