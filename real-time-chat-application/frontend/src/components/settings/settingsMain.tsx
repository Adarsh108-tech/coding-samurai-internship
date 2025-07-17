"use client";

import { Account } from "./Account";
import { ChatSettings } from "./chatsHistory";
import { Help } from "./Help";
import { NotificationSettings } from "./notification";
import { PersonalizationSettings } from "./personalization";
import { useTheme } from "@/context/ThemeContext";

interface SettingsMainProps {
  section: string;
}

export const SettingsMain = ({ section }: SettingsMainProps) => {
  const { mode, toggleMode } = useTheme();

  const renderSection = () => {
    switch (section) {
      case "accounts":
        return <Account />;
      case "chatHistory":
        return <ChatSettings totalDataUsed="18.4 MB" textSize="medium" />;
      case "help":
        return <Help />;
      case "notification":
        return <NotificationSettings />;
      case "personalizations":
        return <PersonalizationSettings />;
      default:
        return (
          <div className="text-black dark:text-white">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select an option from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="p-4 overflow-y-auto h-full bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      {/* Theme toggle button shown always on top-right */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleMode}
          className="px-4 py-2 bg-gray-800 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition"
        >
          Switch to {mode === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>

      {renderSection()}
    </div>
  );
};
