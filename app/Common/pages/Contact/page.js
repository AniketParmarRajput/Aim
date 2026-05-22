'use client';

import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/contact/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const inputClass = "w-full pl-9 pr-4 py-2.5 border-[1.5px] border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all";

  return (
    <div className="min-h-screen bg-[#f0f4ff] py-10 px-4 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-blue-400/8 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-500 text-[11.5px] font-semibold px-3 py-1.5 rounded-full mb-3">
            ✉️ Get in Touch
          </div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Contact Us</h1>
          <p className="text-[13px] text-gray-400 mt-2">
            Wed love to hear from you. Send us a message and well respond shortly.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-indigo-100 rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.07)] px-8 py-8 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name + Email row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                  Your Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">👤</span>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} required placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">✉️</span>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} required placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                Subject
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🏷️</span>
                <input
                  type="text" name="subject" value={formData.subject}
                  onChange={handleChange} required placeholder="What's this about?"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-[12.5px] font-semibold text-gray-700 mb-1.5">
                Message
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm pointer-events-none">💬</span>
                <textarea
                  name="message" value={formData.message}
                  onChange={handleChange} required rows={5}
                  placeholder="Write your message here..."
                  className="w-full pl-9 pr-4 py-2.5 border-[1.5px] border-gray-200 bg-gray-50 rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-linear-to-br from-indigo-500 to-indigo-600 text-white rounded-xl text-[14px] font-bold tracking-wide shadow-md shadow-indigo-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 mt-1"
            >
              ➤ Send Message
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: "📍", label: "Address", value: "123 Main Street, City, Country", bg: "bg-indigo-50", text: "text-indigo-500" },
            { icon: "📞", label: "Phone",   value: "+1 (555) 123-4567",             bg: "bg-green-50",  text: "text-green-600" },
            { icon: "📧", label: "Email",   value: "contact@example.com",           bg: "bg-orange-50", text: "text-orange-500" },
          ].map(({ icon, label, value, bg, text }) => (
            <div key={label} className="bg-white border border-indigo-100 rounded-2xl px-5 py-5 text-center shadow-sm">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3 text-lg`}>
                {icon}
              </div>
              <p className={`text-[12px] font-700 font-bold ${text} mb-1`}>{label}</p>
              <p className="text-[12px] text-gray-400 leading-relaxed">{value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Contact;