// components/Sidebar.jsx
'use client';
import { Home, Plus, User, Settings, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition">
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <>
      {/* Mobile Sidebar (Overlay) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed md:static top-0 left-0 w-64 min-h-screen bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:flex flex-col p-6`}
      >
        {/* Close button for mobile */}
        <button className="md:hidden absolute top-4 right-4" onClick={onClose}>
          <X className="text-gray-600 dark:text-gray-300" />
        </button>

        <div className="text-2xl font-bold mb-8 text-violet-700 dark:text-violet-300">IP Blogs</div>

        <nav className="flex flex-col gap-4">
          <Link href="/pages/home">
            <SidebarItem icon={<Home size={18} />} label="Home" />
          </Link>
          <Link href="/pages/createBlog">
            <SidebarItem icon={<Plus size={18} />} label="Create Post" />
          </Link>
          <Link href="/pages/profile">
            <SidebarItem icon={<User size={18} />} label="Profile" />
          </Link>
          <Link href="/pages/settings">
            <SidebarItem icon={<Settings size={18} />} label="Settings" />
          </Link>
          <button onClick={handleLogout} className="text-left">
            <SidebarItem icon={<LogOut size={18} />} label="Logout" />
          </button>
        </nav>
      </aside>
    </>
  );
}
