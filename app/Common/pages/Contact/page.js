'use client';

import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    const res = await fetch("http://localhost:5000/api/contact/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    subject:formData.subject,
    message: formData.message,
  }),
});

// const data = await response.json()
//     console.log("resp", data)
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-900 mb-8 text-center'>Contact Us</h1>
        
        <div className='bg-white rounded-lg shadow-md p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Your Name'
              />
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='your.email@example.com'
              />
            </div>

            <div>
              <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-2'>
                Subject
              </label>
              <input
                type='text'
                id='subject'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Message Subject'
              />
            </div>

            <div>
              <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-2'>
                Message
              </label>
              <textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleChange}
                required
                rows='5'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Your message here...'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200'
            >
              Send Message
            </button>
          </form>
        </div>

        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Address</h3>
            <p className='text-gray-600'>123 Main Street, City, Country</p>
          </div>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Phone</h3>
            <p className='text-gray-600'>+1 (555) 123-4567</p>
          </div>
          <div className='text-center'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Email</h3>
            <p className='text-gray-600'>contact@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
