"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Phone, Bot, Settings, User, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { SettingsModal } from "./SettingsModal";
import { ProfileModal } from "./ProfileModal";

interface SideBarProps {
  profileImage?: string;
}

export const SideBar = ({ profileImage }: SideBarProps) => {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false); // ✅

  const { selectedTheme, mode, toggleMode } = useTheme();

  return (
    <>
      <div
        className="w-16 text-white flex flex-col items-center py-4 space-y-6"
        style={{ backgroundColor: selectedTheme }}
      >
        <Home onClick={() => router.push("/pages/ChatDash")} className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-200" />
        <Phone onClick={() => router.push("/pages/callsDash")} className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-200" />
        <Bot onClick={() => router.push("/pages/Bot")} className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-200" />
        <Settings onClick={() => setSettingsOpen(true)} className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-200" />
        {mode === "light" ? (
          <Moon onClick={toggleMode} className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-200" />
        ) : (
          <Sun onClick={toggleMode} className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-200" />
        )}
        {profileImage ? (
          <Image
            src={profileImage}
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={() => setProfileModalOpen(true)} // ✅
          />
        ) : (
          <User className="w-6 h-6 cursor-pointer hover:scale-125 transition-transform duration-200" onClick={() => setProfileModalOpen(true)} />
        )}
      </div>

      {settingsOpen && (
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      )}

      {profileModalOpen && (
        <ProfileModal onClose={() => setProfileModalOpen(false)} />
      )}
    </>
  );
};