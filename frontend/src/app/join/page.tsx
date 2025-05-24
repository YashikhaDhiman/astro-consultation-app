'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', question: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:5000/api/queue/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('ticketId', data._id);
      router.push(`/chat/${data._id}`);
    } else {
      setError(data.message || 'Something went wrong.');
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Join the Consultation Queue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Your Name"
          required
          onChange={handleChange}
          className="chat-input"
        />
        <input
          name="email"
          placeholder="Your Email"
          type="email"
          onChange={handleChange}
          className="chat-input"
        />
        <textarea
          name="question"
          placeholder="Your Question"
          required
          rows={4}
          onChange={handleChange}
          className="chat-input"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Join Queue
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </main>
  );
}
