"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";
import axios from "@/utils/axiosInstance";
import { useUser } from "@/context/UserContext";

interface Contact {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface AddChatModalProps {
  onClose: () => void;
  contacts?: Contact[];
}

export const AddChatModal = ({ onClose, contacts = [] }: AddChatModalProps) => {
  const [mode, setMode] = useState<"default" | "contact" | "group">("default");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState<string | null>(null);

  const { user } = useUser();
  const userId = user?.id;

  const toggleContactSelection = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleGroupImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddContact = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("⚠️ No token found");

      const contactId = contactInfo.trim();
      if (!contactId) return alert("⚠️ Please enter a valid Contact ID");

      await axios.post(
        "/user/add-contact",
        { contactId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Contact added!");
      onClose();
    } catch (err: any) {
      alert(`❌ Error: ${err?.response?.data?.error || err.message}`);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedContacts.length === 0) {
      return alert("⚠️ Please provide a group name and at least one member.");
    }

    try {
      if (!userId) return alert("⚠️ User not logged in");
      const token = localStorage.getItem("token");
      if (!token) return alert("⚠️ No token found");

      await axios.post(
        "/group/create",
        {
          name: groupName,
          description: groupDescription || "No description provided.",
          group_picture: groupImage || "https://picsum.photos/300",
          created_by: userId,
          members: [userId, ...selectedContacts],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Group created!");
      onClose();
    } catch (err: any) {
      alert(`❌ Error: ${err?.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Default Mode */}
        {mode === "default" && (
          <>
            <h3 className="text-lg font-semibold mb-4">What do you want to add?</h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setMode("contact")}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                ➕ A New Contact
              </button>
              <button
                onClick={() => setMode("group")}
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                👥 A New Group
              </button>
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:underline mt-2"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Add Contact Mode */}
        {mode === "contact" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Add New Contact</h3>
            <input
              type="text"
              placeholder="Enter Contact ID"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setMode("default")}
                className="text-sm text-gray-500 hover:underline"
              >
                ← Back
              </button>
              <button
                onClick={handleAddContact}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={!contactInfo.trim()}
              >
                Add Contact
              </button>
            </div>
          </>
        )}

        {/* Create Group Mode */}
        {mode === "group" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Create Group</h3>

            <div className="flex items-center justify-center mb-4">
              <label className="cursor-pointer relative">
                {groupImage ? (
                  <Image
                    src={groupImage}
                    alt="Group"
                    width={100}
                    height={100}
                    className="rounded-full object-cover w-24 h-24"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <Camera className="text-gray-600 dark:text-white" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleGroupImageUpload}
                />
              </label>
            </div>

            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white mb-3"
            />
            <textarea
              placeholder="Group Description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white mb-3"
            />

            <div className="h-48 overflow-y-auto border p-2 rounded mb-4 bg-gray-100 dark:bg-gray-700">
              {contacts.map((contact) => (
                <label key={contact.id} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => toggleContactSelection(contact.id)}
                    className="accent-blue-600"
                  />
                  {contact.avatarUrl ? (
                    <Image
                      src={contact.avatarUrl}
                      alt={contact.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                  )}
                  <span className="text-sm">{contact.name}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setMode("default")}
                className="text-sm text-gray-500 hover:underline"
              >
                ← Back
              </button>
              <button
                onClick={handleCreateGroup}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={!groupName || selectedContacts.length === 0}
              >
                Create Group
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
