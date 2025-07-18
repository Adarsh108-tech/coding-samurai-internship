"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "@/utils/api";

export default function GetStarted() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const toggleForm = () => {
    console.log("Toggling form. Current mode:", isLogin ? "Login" : "Register");
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setIsLogin((prev) => !prev);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (!isLogin && (!form.name || !form.confirmPassword))) {
      return toast.error("Please fill all fields");
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      if (isLogin) {
        const res = await loginUser({ email: form.email, password: form.password });
        if (res.token) {
          toast.success("Login successful!");
          localStorage.setItem("token", res.token);
          router.push("/dashboard");
        } else {
          toast.error(res.message || "Login failed");
        }
      } else {
        const res = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        if (res.token) {
          toast.success("Registration successful!");
          setIsLogin(true);
        } else {
          toast.error(res.message || "Registration failed");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-black">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {/* Debug Mode */}

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.jpg"
            alt="Company Logo"
            className="rounded-full"
            width={100}
            height={100}
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
