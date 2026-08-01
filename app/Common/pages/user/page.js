"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useRouter } from "next/navigation";
import PageHero from "@/app/Components/Reusable/PageHero";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/Common/pages/login"); return; }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/get-by-email/${user.email}`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setProfile(result.data);
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

  return (
    <div className="min-h-screen bg-brand-cream">
      <PageHero
        badge="👤 My Account"
        title="Welcome To Your"
        titleGradient="Profile"
        subtitle="View your account details, manage your profile, and enjoy a personalized shopping experience."
        showExplore={false}
        features={[
          { icon: "🛍️", title: "My Orders", sub: "Track purchases" },
          { icon: "🔐", title: "Secure Account", sub: "Protected login" },
          { icon: "⭐", title: "Rewards", sub: "Exclusive perks" },
          { icon: "🎁", title: "Offers", sub: "Personal deals" },
        ]}
      />
      <div className="px-4 py-10">
        <div className="max-w-xl mx-auto">
        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-8 py-8">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center text-white text-2xl font-bold">
                  {(profile?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{profile?.name || "User"}</h1>
                  <p className="text-sm text-gray-400">{profile?.role === "admin" ? "Administrator" : profile?.role || "Customer"}</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-5" />

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">ID</label>
                  <p className="text-[15px] font-semibold text-gray-900">{profile?.id || "—"}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">Full Name</label>
                  <p className="text-[15px] font-semibold text-gray-900">{profile?.name || "—"}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">Email Address</label>
                  <p className="text-[15px] font-semibold text-gray-900">{profile?.email || "—"}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">Role</label>
                  <p className="text-[15px] font-semibold text-gray-900 capitalize">{profile?.role || "—"}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-400 font-medium">Position</label>
                  <p className="text-[15px] font-semibold text-gray-900">{profile?.position || "—"}</p>
                </div>
              </div>
            </>
          )}

          <div className="h-px bg-gray-100 my-5" />

          <button onClick={() => router.push("/Common/pages/home")} className="w-full py-2.5 bg-brand-dark text-white rounded-xl text-[14px] font-bold hover:opacity-90 transition-all">
            Back to Home
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
