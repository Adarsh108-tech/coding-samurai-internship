"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal = ({ onClose }: ProfileModalProps) => {
  const { user, loading } = useUser();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl text-black dark:text-white">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl text-black dark:text-white">
          User not found
        </div>
      </div>
    );
  }

  const {
    id,
    name,
    description,
    resume_link,
    role,
    profile_picture,
  } = user;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl w-[90%] max-w-[600px] shadow-lg text-black dark:text-white relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          aria-label="Close Profile Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Your Profile</h2>

        {/* Profile Picture */}
        <div className="flex items-center gap-4 mb-4">
          {profile_picture ? (
            <img
              src={profile_picture}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Display Fields */}
        <div className="space-y-2 text-sm">
          <div><strong>ID:</strong> {id}</div>
          <div><strong>Name:</strong> {name || "N/A"}</div>
          <div><strong>Description:</strong> {description || "No description provided"}</div>
          <div>
            <strong>Resume:</strong>{" "}
            {resume_link ? (
              <a
                href={resume_link}
                className="text-blue-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            ) : (
              "Not uploaded"
            )}
          </div>
          <div><strong>Role:</strong> {role || "Not specified"}</div>
        </div>
      </div>
    </div>
  );
};
