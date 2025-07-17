"use client";

import { useRef, useEffect, useState } from "react";
import { SettingsSidebar } from "./settings/sideBar";
import { SettingsMain } from "./settings/settingsMain";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeSection, setActiveSection] = useState("accounts");
  const modalRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-30">
      <div
        ref={modalRef}
        className="w-[600px] h-[400px] bg-white shadow-xl rounded-xl border flex overflow-hidden relative"
      >
        <SettingsSidebar active={activeSection} setActive={setActiveSection} />
        <div className="flex-1 relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
            <X className="w-5 h-5" />
          </button>
          <SettingsMain section={activeSection} />
        </div>
      </div>
    </div>
  );
};
