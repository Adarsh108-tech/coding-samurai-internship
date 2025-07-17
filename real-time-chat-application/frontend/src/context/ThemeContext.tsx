// ThemeContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ThemeContextProps {
  selectedTheme: string;
  setSelectedTheme: (color: string) => void;
  mode: "light" | "dark";
  toggleMode: () => void;
  setMode: (m: "light" | "dark") => void;
  backgroundImage: string | null;
  setBackgroundImage: (image: string | null) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("#f87171");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);

  // Load initial values from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("selectedTheme");
    const storedMode = localStorage.getItem("themeMode") as "light" | "dark" | null;
    const storedBg = localStorage.getItem("backgroundImage");

    if (storedTheme) setSelectedTheme(storedTheme);
    if (storedMode) setMode(storedMode);
    if (storedBg) setBackgroundImageState(storedBg);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = selectedTheme;
    localStorage.setItem("selectedTheme", selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", mode === "dark");
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem("backgroundImage", backgroundImage);
    } else {
      localStorage.removeItem("backgroundImage");
    }
  }, [backgroundImage]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setBackgroundImage = (image: string | null) => {
    setBackgroundImageState(image);
  };

  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        setSelectedTheme,
        mode,
        toggleMode,
        setMode,
        backgroundImage,
        setBackgroundImage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
