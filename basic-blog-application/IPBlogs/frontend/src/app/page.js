'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Sun, Moon } from 'lucide-react';
import Image from 'next/image';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [theme, setTheme] = useState('light');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // 🔄 Handle theme + redirect if already logged in
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);

    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);

    const token = localStorage.getItem('token');
    if (token) router.replace('/pages/home');
  }, [theme, router]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      return toast.error('Please fill all required fields');
    }

    const endpoint = isLogin ? '/login' : '/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const res = await fetch(`http://localhost:5000/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id); // ✅ Store user ID
        toast.success('Login successful!');
        router.push('/pages/home');
      } else {
        toast.success('Account created! Please log in.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black bg-gradient-to-br from-violet-100 to-white dark:from-gray-900 dark:to-gray-950 transition-colors px-4">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 shadow rounded-full transition"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-violet-700" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-300" />
        )}
      </button>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex justify-center mb-2">
          <Image
            src="/assets/ip-blogs-logo.png"
            alt="IP Blogs Logo"
            width={60}
            height={60}
          />
        </div>

        <h1 className="text-center text-2xl font-semibold text-violet-700 dark:text-violet-300">
          {isLogin ? 'Login to IP Blogs' : 'Join IP Blogs'}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-md font-medium transition"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-600 hover:underline font-medium"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
