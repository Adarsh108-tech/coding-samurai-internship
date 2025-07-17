// context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  profile_picture: string | null;
  role: string | null;
  description: string | null;
  resume_link: string | null;
  theme_color: string | null;
  theme_mode: "light" | "dark" | null;
  background_image: string | null;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  loading: boolean;
  setLoading: (state: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return setLoading(false);

    // Don't fetch here — just wait for DashboardPage to call setUser
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
