'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const router = useRouter();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('authChanged')); // 👈 trigger header update
      router.push(data.user.role === 'astrologer' ? '/inbox' : `/chat/${data.user.id}`);
    } else {
      alert(data.message || 'Signup failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4 font-bold text-gray-900">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleChange} required className="w-full p-3 border border-gray-400 rounded text-gray-900 placeholder-gray-600" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border border-gray-400 rounded text-gray-900 placeholder-gray-600" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border border-gray-400 rounded text-gray-900 placeholder-gray-600" />
        <select name="role" onChange={handleChange} className="w-full p-3 border border-gray-400 rounded text-gray-900 placeholder-gray-600">
          <option value="customer">Customer</option>
          <option value="astrologer">Astrologer</option>
        </select>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}
