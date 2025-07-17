// File: components/Conversations.tsx
"use client";

interface Conversation {
  id: string;
  title: string;
  preview: string;
}

interface ConversationsProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
}

export const Conversations = ({ conversations, onSelect }: ConversationsProps) => {
  return (
    <div className="w-80 h-screen p-4 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <div className="space-y-2 overflow-y-auto max-h-[85vh] pr-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => onSelect(conv.id)}
          >
            <h4 className="font-medium">{conv.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {conv.preview}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
