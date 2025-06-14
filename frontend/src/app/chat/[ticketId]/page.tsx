'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';

export default function ChatPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params); // Unwrap the params Promise
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:5000/api/messages/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
  }, [ticketId, token]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const res = await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newMessage }),
    });

    const data = await res.json();
    setMessages([...messages, data]);
    setNewMessage('');
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">Chat</h2>

      <div className="flex flex-col gap-2 border p-4 rounded max-h-[400px] overflow-y-auto">
        {messages.map((msg: any, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded">
            <div className="text-xs text-gray-600">{msg.sender?.name || 'You'}:</div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          className="border px-4 py-2 flex-1 rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}