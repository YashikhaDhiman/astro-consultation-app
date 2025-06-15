'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowNav(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed._id) {
          setUser(parsed);
        }
      } catch {
        setUser(null);
      }
    }
    setHydrated(true);

    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <Link href="/" className="text-2xl font-semibold tracking-wide">🔮 AstroConsult</Link>
      <div className="flex gap-4 items-center">
        {!user && (
          <>
            <Link href="/login" className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white">Login</Link>
            <Link href="/signup" className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white">Signup</Link>
          </>
        )}
        {user && (
          <>
            {user.role === 'customer' && (
              <Link href={`/chat/${user.id}`} className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white">Chat</Link>
            )}
            {user.role === 'astrologer' && (
              <Link href="/inbox" className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-black">Inbox</Link>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.dispatchEvent(new Event('authChanged'));
                location.href = '/';
              }}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>

  );
}
