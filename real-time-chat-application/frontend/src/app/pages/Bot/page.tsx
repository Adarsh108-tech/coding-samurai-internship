// File: app/pages/BotDash.tsx
"use client";

import { useState } from "react";
import { SideBar } from "@/components/sideBar";
import { Conversations } from "@/components/Conversations";
import { ChatWithBot } from "@/components/ChatWithBot";
import { useTheme } from "@/context/ThemeContext";

const sampleBotConversations = [
  { id: "1", title: "Order Inquiry", preview: "Where is my order?" },
  { id: "2", title: "Weather Bot", preview: "What's the weather today?" },
  { id: "3", title: "Travel Assistant", preview: "Find me flights to Tokyo." },
];

export default function BotDashboard() {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const { selectedTheme, mode } = useTheme();

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
      style={{ backgroundColor: selectedTheme }}
    >
      <SideBar profileImage="/user-avatar.png" />
      <Conversations
        conversations={sampleBotConversations}
        onSelect={(id) => setSelectedConvId(id)}
      />
      <ChatWithBot conversationId={selectedConvId} />
    </div>
  );
}
