"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

interface ChatSettingsProps {
  totalDataUsed: string; // e.g., "12.5 MB"
  textSize: "small" | "medium" | "large";
  onTextSizeChange?: (size: "small" | "medium" | "large") => void;
  onClearChats?: () => void;
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({
  totalDataUsed,
  textSize,
  onTextSizeChange,
  onClearChats,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { selectedTheme } = useTheme();

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-xl space-y-6 text-black dark:text-white">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chats</h2>

      <div className="space-y-3">
        {/* Text Size Selector */}
        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
            Text Size
          </label>
          <select
            value={textSize}
            onChange={(e) =>
              onTextSizeChange?.(e.target.value as "small" | "medium" | "large")
            }
            className="w-full border rounded px-3 py-2 bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2"
            style={{
              borderColor: selectedTheme,
            }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Total Data Used */}
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Total Data of Chats:
          </p>
          <p className="text-gray-600 dark:text-gray-400">{totalDataUsed}</p>
        </div>

        {/* Clear Chat Buttons */}
        <div className="pt-4">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Clear All Chats
            </button>
          ) : (
            <div className="space-x-4">
              <button
                onClick={() => {
                  onClearChats?.();
                  setShowConfirm(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Confirm: Clear All My Chats
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-500 dark:text-gray-400 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
