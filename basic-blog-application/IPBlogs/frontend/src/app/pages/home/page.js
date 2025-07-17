'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/SideBar';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 🔁 Sidebar toggle state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        if (!res.ok) throw new Error('Failed to load');

        const data = await res.json();
        const transformed = data.map((p) => ({
          ...p,
          profilePic: '/assets/ip-blogs-logo.png',
          username: p.author_name || 'Anonymous',
          likes: p.likes || 0,
          dislikes: p.dislikes || 0,
          comments: [],
        }));
        setPosts(transformed);
      } catch (err) {
        toast.error('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 px-4 py-6">
        {/* Mobile Toggle Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-violet-600 dark:text-violet-300"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">IP Blogs</h1>
          <ThemeToggle />
        </div>

        <section className="max-w-6xl mx-auto grid gap-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading posts...</p>
          ) : posts.length ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-center text-gray-500">No posts found.</p>
          )}
        </section>
      </div>
    </main>
  );
}
