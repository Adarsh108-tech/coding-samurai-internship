"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"// or your toast library

export default function AuthSwitcher() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email, password }
        : { email, password, fullName };

      const res = await axios.post(endpoint, payload);

      if (isLogin) {
        const token = res.data.session.access_token;
        localStorage.setItem("token", token);
        toast.success("✅ Logged in successfully!");
        router.push("/pages/ChatDash");
      } else {
        toast.success("✅ Registered successfully! Please login.");
        setIsLogin(true);
      }

      setEmail("");
      setPassword("");
      setFullName("");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "❌ Something went wrong"
      );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 to-blue-500">
      {/* Floating Circles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white/20 rounded-full backdrop-blur-sm"
          initial={{ y: -50, x: Math.random() * 1000 }}
          animate={{ y: [0, 500], opacity: [1, 0] }}
          transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
          style={{ left: `${Math.random() * 100}%` }}
        />
      ))}

      {/* Auth Card */}
      <div className="z-10 bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md w-full max-w-md">
        <div className="flex justify-center mb-6 rounded-full">
          <Image className="rounded-full" src="/logo.png" alt="Company Logo" width={100} height={100} />
        </div>

        <h2 className="text-2xl font-semibold text-white text-center mb-4">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              placeholder="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-white/20 placeholder-white text-white"
            />
          )}

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/20 placeholder-white text-white"
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/20 placeholder-white text-white"
          />

          <Button
            type="submit"
            className="w-full bg-white/80 hover:bg-white text-purple-700 font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>

        <p className="text-center text-white/80 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 underline text-white hover:text-yellow-300"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
