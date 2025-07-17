"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export const NotificationSettings = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showBadge, setShowBadge] = useState(false);
  const [autoDownload, setAutoDownload] = useState(true);
  const { mode } = useTheme(); // optional, in case you want to log/use the mode

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-xl space-y-6 text-black dark:text-white">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Notification Settings
      </h2>

      <div className="space-y-5">
        {/* Notification Banner Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Display notification above the screen
          </span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showBanner}
              onChange={() => setShowBanner(!showBanner)}
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
          </label>
        </div>

        {/* Badge Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Display message on the app icon
          </span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showBadge}
              onChange={() => setShowBadge(!showBadge)}
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
          </label>
        </div>

        {/* Auto-download media Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Download the media automatically
          </span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={autoDownload}
              onChange={() => setAutoDownload(!autoDownload)}
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
