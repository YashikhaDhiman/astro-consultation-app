'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface InboxItem {
  _id: string; // message ID
  text: string;
  sender: string;
  timestamp: string;
  ticketId: string;
  customer: {
    name: string;
    email: string;
    priority: number;
  };
}

export default function InboxPage() {
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/messages')
      .then(res => res.json())
      .then((messages: InboxItem[]) => {
        // Group messages by ticketId, show latest per ticket
        const grouped: { [ticketId: string]: InboxItem } = {};
        messages.forEach(msg => {
          if (
            !grouped[msg.ticketId] ||
            new Date(msg.timestamp) > new Date(grouped[msg.ticketId].timestamp)
          ) {
            grouped[msg.ticketId] = msg;
          }
        });
        setInbox(Object.values(grouped));
      });
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Astrologer's Inbox</h1>
      <div className="space-y-4">
        {inbox.map(item => (
          <div
            key={item._id}
            onClick={() => router.push(`/chat/${item.ticketId}`)}
            className="p-4 border rounded cursor-pointer hover:bg-gray-100"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{item.customer.name}</p>
                <p className="text-sm text-gray-500">Priority: {item.customer.priority}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="mt-2">{item.text}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
