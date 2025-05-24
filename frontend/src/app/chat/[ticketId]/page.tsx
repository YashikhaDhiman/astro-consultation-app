'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // match your backend

interface Message {
  _id?: string;
  sender: string;
  text: string;
  timestamp?: string;
  ticketId: string;
}

export default function ChatPage() {
  const { ticketId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');

  // Connect and join room
  useEffect(() => {
    socket.emit('joinRoom', ticketId);

    fetch(`http://localhost:5000/api/messages/${ticketId}`)
      .then(res => res.json())
      .then(data => setMessages(data));

    socket.on('receiveMessage', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const message: Message = {
      sender: 'customer',
      text,
      ticketId: ticketId as string
    };

    // Emit to socket
    socket.emit('sendMessage', message);

    // Persist to DB
    await fetch('http://localhost:5000/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    setText('');
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Your Consultation</h1>

      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto border p-4 rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded ${msg.sender === 'customer' ? 'bg-blue-100' : 'bg-green-100'}`}>
            <p className="text-sm font-semibold">{msg.sender === 'customer' ? 'You' : 'Astrologer'}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your message"
          className="chat-input"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </main>
  );
}
