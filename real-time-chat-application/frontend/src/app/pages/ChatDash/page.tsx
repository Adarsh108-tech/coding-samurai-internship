"use client";

import { useEffect, useState } from "react";
import { SideBar } from "@/components/sideBar";
import { RecentChats } from "@/components/RecentChats";
import { Chats } from "@/components/Chats";
import { AddChatModal } from "@/components/AddChatModal";
import axios from "@/utils/axiosInstance";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";

interface Chat {
  id: string;
  name: string;
  avatarUrl?: string;
  isGroup?: boolean;
}

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

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { setUser } = useUser();
  const { setSelectedTheme, setMode, setBackgroundImage } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.sub);
        console.debug("🪪 Token Decoded UserID:", decoded.sub);
      } catch (err) {
        console.warn("⚠️ Failed to decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { user, contacts, groups } = res.data;
        setUser(user);
        console.debug("✅ Dashboard User Loaded:", user);

        if (user.theme_color) setSelectedTheme(user.theme_color);
        if (user.theme_mode) setMode(user.theme_mode);
        if (user.background_image) setBackgroundImage(user.background_image);

        const combined: Chat[] = [
          ...contacts.map((c: any) => ({
            id: c.id,
            name: c.name,
            avatarUrl: c.profile_picture,
            isGroup: false,
          })),
          ...groups.map((g: any) => ({
            id: g.id,
            name: g.name,
            avatarUrl: g.group_picture,
            isGroup: true,
          })),
        ];

        setChatList(combined);
        if (combined.length > 0) {
          setSelectedChat(combined[0]);
        }
      } catch (err: any) {
        console.error("❌ Failed to load dashboard:", err.response?.data || err.message);
      }
    };

    if (userId) fetchDashboard();
  }, [userId, setUser, setSelectedTheme, setMode, setBackgroundImage]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) {
        setChatMessages([]);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("/user/messages", {
          params: {
            receiver_id: selectedChat.id,
            is_group: selectedChat.isGroup ?? false,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        console.debug("💬 Messages fetched for:", selectedChat.name);
        setChatMessages(res.data);
      } catch (err: any) {
        console.error("❌ Failed to fetch messages:", err.response?.data || err.message);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  return (
    <div className="flex transition-all duration-300 relative">
      <SideBar />

      <RecentChats
        chats={chatList}
        onChatSelect={(chat) => setSelectedChat(chat)}
        onAddClick={() => setShowModal(true)}
      />

      {selectedChat && (
        <Chats
          key={selectedChat.id}
          userId={userId ?? ""}
          receiver={selectedChat}
          messages={chatMessages}
        />
      )}

      {showModal && (
        <AddChatModal
          onClose={() => setShowModal(false)}
          contacts={chatList}
        />
      )}
    </div>
  );
}
