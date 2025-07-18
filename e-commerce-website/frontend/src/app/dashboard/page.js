"use client";

import { useEffect } from "react";
import DashboardNavbar from "@/components/navbar";
import Sidebar from "@/components/sideBar";
import ProductCard from "@/components/productCard";
import { useItemContext } from "@/context/ItemContext";
import toast from "react-hot-toast";

// Sample product list
const products = [
  {
    name: "Wireless Headphones",
    price: 2499,
    image: "/OIP.png",
    description: "High-quality wireless headphones with noise cancellation and deep bass."
  },
  {
    name: "Smartphone",
    price: 15999,
    image: "/smartphone.png",
    description: "High-quality wireless headphones with noise cancellation and deep bass."
  },
  {
    name: "Laptop",
    price: 45999,
    image: "/laptop.jpg",
    description: "High-quality wireless headphones with noise cancellation and deep bass."
  },
  {
    name: "Running Shoes",
    price: 3499,
    image: "/shoes.jpg",
    description: "High-quality wireless headphones with noise cancellation and deep bass."
  },
  {
    name: "Office Chair",
    price: 5999,
    image: "/officeChair.png",
    description: "High-quality wireless headphones with noise cancellation and deep bass."
  },
];

export default function DashboardPage() {
  const { setUser } = useItemContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in");
          return;
        }

        const res = await fetch("http://localhost:5000/user/getUserData", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch user data");
          return;
        }

        setUser(data); // save user data in context
        toast.success("Welcome back, " + data.name);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
      }
    };

    fetchUserData();
  }, [setUser]);

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Navbar */}
      <DashboardNavbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
