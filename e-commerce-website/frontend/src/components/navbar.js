"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Home } from "lucide-react"; // Added Home icon

export default function DashboardNavbar() {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left Section: Home + Logo + Name */}
      <div className="flex items-center space-x-4">
        {/* Home Button */}
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          title="Home"
        >
          <Home size={22} className="text-gray-700" />
        </button>

        {/* Logo and Company Name */}
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
        <span className="text-xl font-bold text-gray-800">MyCompany</span>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Section: Cart & Account */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <ShoppingCart size={18} />
          <span>Cart</span>
        </button>

        <button
          onClick={() => router.push("/account")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <User size={18} />
          <span>Account</span>
        </button>
      </div>
    </nav>
  );
}
