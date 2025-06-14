'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load once
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    // Listen for login/signup events
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChanged')); // update header
    window.location.href = '/';
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md">
      <Link href="/" className="text-xl font-bold">🔮 AstroConnect</Link>
      <nav className="flex gap-4 items-center">
        {user ? (
          <>
            {user.role === 'astrologer' ? (
              <Link href="/inbox" className="text-blue-600 font-medium">Inbox</Link>
            ) : (
              <Link href={`/chat/${user._id}`} className="text-green-600 font-medium">Chat</Link>
            )}
            <button onClick={handleLogout} className="text-red-600 font-medium">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}
