"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  User,
  MessageSquare,
  HelpCircle,
  Bell,
  Palette,
  Moon,
  Sun,
} from "lucide-react";

interface SettingsSidebarProps {
  active: string;
  setActive: (section: string) => void;
}

const items = [
  { key: "accounts", label: "Account", icon: <User className="w-4 h-4" /> },
  { key: "chatHistory", label: "Chat History", icon: <MessageSquare className="w-4 h-4" /> },
  { key: "help", label: "Help", icon: <HelpCircle className="w-4 h-4" /> },
  { key: "notification", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { key: "personalizations", label: "Personalize", icon: <Palette className="w-4 h-4" /> },
];

export const SettingsSidebar = ({ active, setActive }: SettingsSidebarProps) => {
  const { mode, toggleMode } = useTheme();

  return (
    <div className="w-52 border-r bg-gray-50 dark:bg-gray-900 p-4 text-black dark:text-white transition-colors duration-300 space-y-4">
      {/* Section Items */}
      <div className="space-y-2">
        {items.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
              active === key ? "bg-gray-200 dark:bg-gray-800 font-semibold" : ""
            }`}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <hr className="border-t border-gray-300 dark:border-gray-700 my-4" />

      {/* Theme Toggle */}
      <button
        onClick={toggleMode}
        className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
      >
        {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        Switch to {mode === "dark" ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
};
