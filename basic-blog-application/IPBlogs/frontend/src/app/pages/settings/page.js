'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/SideBar';
import Navbar from '@/components/Navbar';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState(null);

  // 🔄 Fetch user data
  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/user/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Failed to fetch user');
        setUsername(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };

    if (id) fetchUser();
  }, []);

  // 🔄 Update Profile (future feature placeholder)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    toast.success('This feature is under development.');
    console.log({ username, email });
  };

  // 🔄 Change Password
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/change-password/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Password update failed');

      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Mobile Toggle Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-violet-600 dark:text-violet-300"
          >
            <Menu size={24} />
          </button>
        </div>

        <Navbar header={'Settings'} />

        <div className="max-w-3xl mx-auto space-y-10">
          {/* Profile Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800"
                placeholder="Username"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800"
                placeholder="Email"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition"
              >
                Save Changes
              </button>
            </form>
          </section>

          {/* Change Password */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800"
                placeholder="Current Password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800"
                placeholder="New Password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800"
                placeholder="Confirm New Password"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition"
              >
                Update Password
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
