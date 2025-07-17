"use client";

import { MessageCircle, Star, HelpCircle, Shield } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const Help: React.FC = () => {
  const { mode } = useTheme();

  const options = [
    { title: "Contact Us", icon: <MessageCircle className="w-5 h-5" /> },
    { title: "Rate the App", icon: <Star className="w-5 h-5" /> },
    { title: "Help Center", icon: <HelpCircle className="w-5 h-5" /> },
    {
      title: "Terms and Privacy Policy",
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-xl space-y-6 text-black dark:text-white">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Help & Support</h2>

      <div className="space-y-4">
        {options.map((option, idx) => (
          <button
            key={idx}
            className="flex items-center w-full justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
            onClick={() => alert(`Navigating to: ${option.title}`)} // replace with real nav logic
          >
            <span className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
              {option.icon}
              {option.title}
            </span>
            <span className="text-gray-400">{">"}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
