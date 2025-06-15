'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/queue/count')
      .then(res => res.json())
      .then(data => setCount(data.count || 0))
      .catch(err => console.error('Error fetching queue count', err));
  }, []);

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">🔮 Welcome to Astro Consult</h1>
      <p className="text-lg">Customers currently in queue: <strong>{count}</strong></p>
    </div>
  );
}
