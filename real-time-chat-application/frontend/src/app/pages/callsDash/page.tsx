"use client";

import { SideBar } from "@/components/sideBar";
import { RecentCalls } from "@/components/RecentCalls";
import { useTheme } from "@/context/ThemeContext";

const sampleCalls = [
  { id: "1", name: "Alice", avatarUrl: "/avatar1.png", callType: "incoming" as const, time: "Today, 9:45 AM" },
  { id: "2", name: "Bob", avatarUrl: "/avatar2.png", callType: "outgoing" as const, time: "Yesterday, 5:30 PM" },
  { id: "3", name: "Charlie", avatarUrl: "/avatar3.png", callType: "incoming" as const, time: "Monday, 2:15 PM" },
  { id: "4", name: "Group Project", avatarUrl: "/group-avatar.png", callType: "outgoing" as const, time: "Sunday, 8:00 PM" },
];

export default function CallsDashboard() {
  const userId = "user123";
  const { selectedTheme, mode } = useTheme();

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
      style={{ backgroundColor: selectedTheme }}
    >
      <SideBar profileImage="/user-avatar.png" />
      <RecentCalls userId={userId} calls={sampleCalls} />
      <div className="flex-1 dark:bg-gray-900 bg-gray-50 flex items-center justify-center">
        <h1 className="text-2xl font-semibold">
          Click on someone to start a call
        </h1>
      </div>
    </div>
  );
}
