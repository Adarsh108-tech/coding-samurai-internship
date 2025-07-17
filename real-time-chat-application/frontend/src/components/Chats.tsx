"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { socket } from "@/utils/socket";
import axios from "@/utils/axiosInstance";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: {
    name: string;
    profile_picture?: string;
  };
}

interface Receiver {
  id: string;
  name: string;
  isGroup?: boolean;
}

interface ChatsProps {
  userId: string;
  receiver: Receiver;
  messages: Message[];
}

export const Chats = ({ userId, receiver, messages }: ChatsProps) => {
  const { selectedTheme, backgroundImage } = useTheme();
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUserIds, setNewUserIds] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages, receiver.id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!userId) return;

    const joinUserRoom = () => socket.emit("join", userId);

    if (!socket.connected) {
      socket.connect();
      socket.on("connect", joinUserRoom);
    } else {
      joinUserRoom();
    }

    return () => {
      socket.off("connect", joinUserRoom);
    };
  }, [userId]);

  useEffect(() => {
    if (receiver?.isGroup) {
      socket.emit("join-group", receiver.id);
    }
  }, [receiver]);

  useEffect(() => {
    const handleIncomingMessage = (msg: Message) => {
      const isRelevant =
        (receiver.isGroup && msg.receiver_id === receiver.id) ||
        (!receiver.isGroup &&
          (msg.sender_id === receiver.id || msg.receiver_id === receiver.id));

      if (isRelevant) {
        setChatMessages((prev) => {
          const exists = prev.some((m) => m.id === msg.id);
          return exists ? prev : [...prev, msg];
        });
      }
    };

    socket.on("receive-message", handleIncomingMessage);
    return () => {
      socket.off("receive-message", handleIncomingMessage);
    };
  }, [receiver]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const payload = {
      sender_id: userId,
      receiver_id: receiver.id,
      content: newMessage.trim(),
      is_group: receiver.isGroup ?? false,
    };

    if (!socket.connected) {
      socket.connect();
      return;
    }

    socket.emit("send-message", payload);
    setNewMessage("");
  };

  const handleAddMembers = async () => {
    const token = localStorage.getItem("token");
    if (!token || !receiver?.isGroup) return;

    const user_ids = newUserIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (user_ids.length === 0) {
      alert("Please enter at least one user ID.");
      return;
    }

    try {
      await axios.post(
        "/group/add-members",
        {
          group_id: receiver.id,
          user_ids,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Members added successfully!");
      setNewUserIds("");
      setShowEditModal(false);
    } catch (err: any) {
      console.error("❌ Failed to add members:", err.response?.data || err.message);
      alert("Failed to add members.");
    }
  };

  const filteredMessages = chatMessages.filter((msg) =>
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col flex-1 h-screen text-black dark:text-white transition-colors duration-300"
      style={{
        backgroundColor: backgroundImage ? undefined : selectedTheme,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 bg-opacity-90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{receiver.name}</h3>
          {receiver.isGroup && (
            <button
              className="ml-2 px-2 py-1 text-sm bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Edit
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none"
        />
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-transparent custom-scrollbar"
        style={{ scrollbarGutter: "stable" }}
      >
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-sm px-4 py-2 rounded-xl text-white ${
              msg.sender_id === userId ? "ml-auto text-right" : "mr-auto text-left"
            }`}
            style={{
              backgroundColor: msg.sender_id === userId ? selectedTheme : "#4b5563",
            }}
          >
            {msg.sender_id !== userId && (
              <div className="text-xs font-semibold text-gray-300 mb-1">
                {msg.sender?.name ?? "Unknown"}
              </div>
            )}
            <div>{msg.content}</div>
          </div>
        ))}
        {filteredMessages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No messages found</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input with Emoji Picker */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 bg-opacity-90 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none"
          />

          {/* Emoji options */}
          <div className="flex gap-1 items-center">
            {["👏🏻", "👍🏻", "🔥", "😁", "👌🏻"].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setNewMessage((prev) => prev + emoji)}
                className="text-xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[90%] max-w-md space-y-4 border border-gray-300 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-center">Add Members to Group</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Enter comma-separated User IDs
            </p>
            <textarea
              rows={4}
              placeholder="user_id_1, user_id_2, ..."
              value={newUserIds}
              onChange={(e) => setNewUserIds(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Members
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
