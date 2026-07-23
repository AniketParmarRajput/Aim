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

  const inputClass = "w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all";

  return (
    <div className="min-h-screen bg-brand-cream py-10 px-4 relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-brand-orange/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-brand-dark/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-brand-orange text-[11.5px] font-semibold px-3 py-1.5 rounded-full mb-3">
            ✉️ Get in Touch
          </div>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Contact Us</h1>
          <p className="text-[13px] text-gray-400 mt-2">
            Wed love to hear from you. Send us a message and well respond shortly.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-brand-light border border-gray-200 rounded-2xl shadow-lg px-8 py-8 mb-4">
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
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-brand-cream rounded-xl text-[13.5px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-brand-orange focus:bg-brand-light transition-all resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-brand-dark text-white rounded-xl text-[14px] font-bold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-1"
            >
              ➤ Send Message
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: "📍", label: "Address", value: "123 Main Street, City, Country" },
            { icon: "📞", label: "Phone",   value: "+1 (555) 123-4567" },
            { icon: "📧", label: "Email",   value: "contact@example.com" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-brand-light border border-gray-200 rounded-2xl px-5 py-5 text-center shadow-sm">
              <div className="w-9 h-9 bg-brand-dark/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-lg">
                {icon}
              </div>
              <p className="text-[12px] font-bold text-brand-dark mb-1">{label}</p>
              <p className="text-[12px] text-gray-400 leading-relaxed">{value}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Contact;