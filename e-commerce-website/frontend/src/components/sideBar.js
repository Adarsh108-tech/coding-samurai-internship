"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageCircle,
  Boxes,
  ChevronDown,
  ChevronUp,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function Sidebar() {
  const [openDepartments, setOpenDepartments] = useState(false);

  const toggleDepartments = () => {
    setOpenDepartments(!openDepartments);
  };

  const categories = [
    "Electronics",
    "Cloths",
    "Garments",
    "Shoes",
    "Accessories",
    "Laptops",
    "Smartphone",
    "Stationary",
    "Medical Things",
  ];

  return (
    <aside className="w-64 h-screen bg-gray-100 shadow-md p-4 sticky top-0">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <nav className="flex flex-col space-y-2">
        {/* Orders */}
        <Link
          href="/orders"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700"
        >
          <LayoutDashboard size={18} />
          Orders
        </Link>

        {/* Chatbot */}
        <Link
          href="/chatbot"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700"
        >
          <MessageCircle size={18} />
          Chatbot
        </Link>

        {/* Departments Dropdown */}
        <button
          onClick={toggleDepartments}
          className="flex items-center justify-between px-4 py-2 w-full rounded-lg hover:bg-gray-200 text-gray-700"
        >
          <span className="flex items-center gap-2">
            <Boxes size={18} />
            Departments
          </span>
          {openDepartments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Departments List */}
        {openDepartments && (
          <ul className="pl-10 space-y-1 mt-1">
            {categories.map((category, index) => (
              <li key={index}>
                <Link
                  href={`/departments/${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-sm text-gray-600 hover:text-blue-600 transition"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Help */}
        <Link
          href="/help"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700"
        >
          <HelpCircle size={18} />
          Help
        </Link>

        {/* Security */}
        <Link
          href="/security"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700"
        >
          <Shield size={18} />
          Security
        </Link>
      </nav>
    </aside>
  );
}
