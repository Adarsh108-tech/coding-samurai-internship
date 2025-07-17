"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/context/ThemeContext";
import axios from "@/utils/axiosInstance";
import Cropper from "react-easy-crop";
import { Camera } from "lucide-react";
import getCroppedImg from "@/lib/cropImageBlob";

export const Account = () => {
  const { selectedTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [profilePicture, setProfilePicture] = useState("/user-avatar.png");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  const [uploading, setUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.user;

        setUserId(user.id);
        setUsername(user.name || "");
        setDescription(user.description || "");
        setRole(user.role || "");
        setResumeLink(user.resume_link || "");
        setProfilePicture(user.profile_picture || "/user-avatar.png");
      } catch (err: any) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setUploading(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const formData = new FormData();
      formData.append("file", croppedBlob);
      formData.append("upload_preset", "welp_preset");

      const res = await fetch("https://api.cloudinary.com/v1_1/dr1fcr2wp/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setProfilePicture(data.secure_url);
        alert("✅ Image uploaded!");
      } else {
        alert("❌ Failed to upload image.");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("❌ Failed to upload image.");
    } finally {
      setUploading(false);
      setCropModalOpen(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "/user/profile",
        {
          id: userId,
          name: username,
          description,
          role,
          resume_link: resumeLink,
          profile_picture: profilePicture,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Profile updated!");
    } catch (err: any) {
      console.error(err);
      alert("❌ Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading account details...</div>;
  }

  return (
    <div className="relative p-6 space-y-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <h2 className="text-xl font-semibold">Account Settings</h2>

      {/* Profile Picture */}
      <div className="flex items-center gap-6">
        <Image
          src={profilePicture}
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full object-cover border border-gray-300"
        />
        <label className="bg-blue-500 text-white p-2 rounded-full cursor-pointer inline-flex">
          <Camera className="w-5 h-5" />
          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
        </label>
      </div>

      {/* User Inputs */}
      <div>
        <label className="block text-sm mb-1">Name</label>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Resume Link</label>
        <Input value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Role</label>
        <Input value={role} onChange={(e) => setRole(e.target.value)} />
      </div>

      <Button onClick={handleSave} className="text-white" style={{ backgroundColor: selectedTheme }}>
        Save
      </Button>

      {/* Cropper Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 w-full max-w-3xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
            <div className="relative w-full h-96 bg-black">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="ghost" onClick={() => setCropModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={uploadCroppedImage} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};