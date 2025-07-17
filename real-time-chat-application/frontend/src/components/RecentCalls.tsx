"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

interface CallEntry {
  id: string;
  name: string;
  avatarUrl?: string;
  callType: "incoming" | "outgoing";
  time: string;
}

interface RecentCallsProps {
  userId: string;
  calls: CallEntry[];
}

export const RecentCalls = ({ userId, calls }: RecentCallsProps) => {
  const { selectedTheme, mode } = useTheme();

  return (
    <div
      className={`w-80 h-screen border-r p-4 transition-colors duration-300 ${
        mode === "dark"
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-white text-black border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Calls</h2>
      </div>
      <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-1">
        {calls.map((call) => (
          <div
            key={call.id}
            className={`flex items-center gap-4 p-2 rounded-md cursor-pointer transition-colors ${
              mode === "dark"
                ? "hover:bg-gray-800"
                : "hover:bg-gray-100"
            }`}
            style={{
              border: `1px solid ${selectedTheme}20`, // subtle border with theme
            }}
          >
            {call.avatarUrl ? (
              <Image
                src={call.avatarUrl}
                alt={call.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
            )}
            <div className="flex-1">
              <p className="font-medium">{call.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {call.time}
              </p>
            </div>
            <div>
              {call.callType === "incoming" ? (
                <ArrowDownLeft className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
