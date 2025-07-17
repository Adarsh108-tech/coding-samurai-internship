"use client";

import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import axios from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

const themeColors = [
  "#b91c1c", "#c2410c", "#ca8a04", "#15803d", "#059669",
  "#0e7490", "#2563eb", "#4f46e5", "#6d28d9", "#be185d",
  "#7e22ce", "#b45309", "#047857", "#1d4ed8", "#5b21b6"
];

const backgroundImages = ["/assasin.jpg", "/godOfWar.jpeg", "/wallpaper.webp", "/yo.jpeg"];

export const PersonalizationSettings = () => {
  const {
    selectedTheme,
    setSelectedTheme,
    mode,
    toggleMode,
    backgroundImage,
    setBackgroundImage
  } = useTheme();

  const { user } = useUser();

  const [initialTheme, setInitialTheme] = useState<string | null>(null);
  const [initialMode, setInitialMode] = useState<"light" | "dark" | null>(null);
  const [initialBackground, setInitialBackground] = useState<string | null>(null);

  // 🟡 Load current user personalization
  useEffect(() => {
    if (user) {
      setInitialTheme(user.theme_color);
      setInitialMode(user.theme_mode);
      setInitialBackground(user.background_image);
    }
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setBackgroundImage(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found.");
      return;
    }

    // 🟢 Avoid API call if nothing changed
    const isThemeChanged = selectedTheme !== initialTheme;
    const isModeChanged = mode !== initialMode;
    const isBackgroundChanged = backgroundImage !== initialBackground;

    if (!isThemeChanged && !isModeChanged && !isBackgroundChanged) {
      alert("No changes detected.");
      return;
    }

    const payload = {
      ...user,
      theme_mode: mode,
      theme_color: selectedTheme,
      background_image: backgroundImage,
    };

    try {
      const res = await axios.put("/user/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Personalization updated!");
      setInitialTheme(selectedTheme);
      setInitialMode(mode);
      setInitialBackground(backgroundImage);
    } catch (err: any) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      alert("Failed to update personalization.");
    }
  };

  return (
    <div
      className="min-h-screen transition-all duration-500"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundColor: selectedTheme,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-95 max-w-5xl mx-auto my-12 p-8 rounded-2xl shadow-2xl text-black dark:text-white">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">🎨 Personalization Settings</h2>
          <button
            onClick={toggleMode}
            className="px-4 py-2 bg-gray-800 dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition"
          >
            Switch to {mode === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>

        {/* Theme Color Picker */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Select Theme Color</h3>
          <div className="grid grid-cols-5 gap-4">
            {themeColors.map((color, index) => (
              <button
                key={index}
                className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                  selectedTheme === color ? "border-black dark:border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedTheme(color)}
              />
            ))}
          </div>
        </div>

        {/* Background Image Picker */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Select Background Image</h3>
          <div className="flex gap-4 flex-wrap mb-4">
            {backgroundImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Background ${idx + 1}`}
                className={`w-32 h-20 object-cover rounded-lg border-4 transition cursor-pointer ${
                  backgroundImage === img ? "border-blue-500 scale-105" : "border-transparent"
                }`}
                onClick={() => setBackgroundImage(img)}
              />
            ))}
          </div>

          {/* Upload Button */}
          <label className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
            Upload Your Background
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit */}
        <div className="mt-8 text-right">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Save Personalization
          </button>
        </div>
      </div>
    </div>
  );
};
