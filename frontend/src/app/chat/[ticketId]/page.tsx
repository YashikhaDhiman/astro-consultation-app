'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [token, setToken] = useState('');
  const [mounted, setMounted] = useState(false);

  // Only run on client after mount
  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t || '');
    setMounted(true);
  }, []);

  // Fetch messages after token is available
  useEffect(() => {
    if (!mounted || !token) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };

    fetchMessages();
  }, [ticketId, token, mounted]);

  const handleSend = async () => {
    if (!newMessage.trim() || !token) return;

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newMessage,
          recipient: ticketId,
        }),
      });

      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold mb-2">💬 Chat</h2>

      <div className="flex flex-col gap-2 border border-gray-300 bg-white p-4 rounded-lg max-h-[400px] overflow-y-auto shadow">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded">
            <div className="text-xs text-gray-700 font-medium">{msg.sender?.name || 'You'}:</div>
            <div className="text-sm text-gray-900">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="border px-4 py-2 flex-1 rounded text-gray-900 placeholder-gray-600 border-gray-300 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  );
}
