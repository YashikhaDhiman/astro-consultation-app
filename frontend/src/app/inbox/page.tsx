'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user || user.role !== 'astrologer') {
      if (mounted) router.push('/');
      return;
    }

    const fetchAllMessages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Unauthorized or failed to load');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
        alert('Could not fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllMessages();
  }, [mounted, token, user, router]);

  if (!mounted || loading) return <div className="p-6">Loading messages...</div>;

  if (!messages.length) return <div className="p-6">No messages found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Inbox</h2>
      <ul className="space-y-4">
        {messages.map((msg, index) => (
          <li
            key={index}
            className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 shadow"
            onClick={() => router.push(`/chat/${msg.sender?._id}`)}
          >
            <div className="text-sm font-semibold text-gray-800">{msg.sender?.name || 'Unknown Sender'}</div>
            <div className="text-xs text-gray-600">{msg.sender?.email || 'Unknown Email'}</div>
            <div className="text-sm text-gray-900 mt-1">{msg.text || 'Empty message'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
