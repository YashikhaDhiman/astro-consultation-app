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
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('authChanged')); // 👈 trigger header update
      router.push(data.user.role === 'astrologer' ? '/inbox' : '/chat');
    } else {
      alert(data.message || 'Signup failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4 font-bold">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleChange} required className="w-full p-2 border" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border" />
        <select name="role" onChange={handleChange} className="w-full p-2 border">
          <option value="customer">Customer</option>
          <option value="astrologer">Astrologer</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 w-full">Sign Up</button>
      </form>
    </div>
  );
}
