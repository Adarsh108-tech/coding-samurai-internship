'use client';
import { Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({header}) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{header}</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 relative">
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
