// File: components/ChatWithBot.tsx
"use client";

import { Bot } from "lucide-react";
import { useState } from "react";

interface ChatWithBotProps {
  conversationId: string | null;
}

export const ChatWithBot = ({ conversationId }: ChatWithBotProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, input]);
    setInput("");
    // You can call your bot response API here and append bot replies
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-center mb-6">
        <Bot className="w-14 h-14 text-blue-500" />
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xl mb-6 overflow-y-auto h-[60vh] p-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="self-end bg-blue-500 text-white px-4 py-2 rounded-xl max-w-xs text-sm"
          >
            {msg}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Start chatting with your AI assistant
          </p>
        )}
      </div>

      <div className="w-full max-w-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask something..."
          className="w-full px-4 py-2 rounded-full border bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none"
        />
      </div>
    </div>
  );
};
