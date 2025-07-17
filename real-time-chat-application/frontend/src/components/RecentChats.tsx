"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

interface Chat {
  id: string;
  name: string;
  lastMessage?: string;
  avatarUrl?: string;
  isGroup?: boolean;
}

interface RecentChatsProps {
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onAddClick: () => void;
}

export const RecentChats = ({ chats, onChatSelect, onAddClick }: RecentChatsProps) => {
  const { selectedTheme } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? chats.filter((chat) =>
        chat.name.toLowerCase().includes(search.toLowerCase())
      )
    : chats;

  return (
    <div className="w-80 h-screen p-4 overflow-hidden bg-white text-black border-r border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Chats</h2>
        <Plus className="w-5 h-5 cursor-pointer" onClick={onAddClick} />
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search chats by username..."
          className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No contacts found
          </p>
        ) : (
          filtered.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-4 p-2 rounded-md cursor-pointer bg-gray-100 dark:bg-gray-800 hover:opacity-90 transition"
              style={{ border: `1px solid ${selectedTheme}` }}
              onClick={() => onChatSelect(chat)}
            >
              {chat.avatarUrl ? (
                <Image
                  src={chat.avatarUrl}
                  alt={chat.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" />
              )}
              <div>
                <p className="font-medium">{chat.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {chat.lastMessage || ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
