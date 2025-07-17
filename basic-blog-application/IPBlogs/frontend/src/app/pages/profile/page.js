'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/SideBar';
import UserPostsList from '@/components/UserPostList';

export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 🔁 Sidebar toggle state

useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedId = localStorage.getItem('userId');
    console.log("userId from localStorage:", storedId);
    if (storedId) {
      setUserId(storedId);
    }
  }
}, []);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Toggle Button */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-violet-600 dark:text-violet-300"
          >
            <Menu size={24} />
          </button>
        </div>

        <Navbar header="Profile Section" />

        <main className="p-6">
          <h2 className="text-3xl font-semibold mb-4">Welcome Back, Adarsh 👋</h2>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Total Posts" value="42" />
            <DashboardCard title="Pending Reviews" value="5" />
            <DashboardCard title="Subscribers" value="1,204" />
          </section>

          <div className="mt-8">
            {userId ? (
              <UserPostsList userId={userId} />
            ) : (
              <p className="text-gray-500">Loading your posts...</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ Dashboard Card Component
function DashboardCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
