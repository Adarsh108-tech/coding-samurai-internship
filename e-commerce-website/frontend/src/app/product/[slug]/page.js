"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useItemContext } from "@/context/ItemContext";
import toast from "react-hot-toast";

export default function ProductPage() {
  const searchParams = useSearchParams();
  const { addToCart } = useItemContext();

  const name = searchParams.get("name");
  const price = searchParams.get("price");
  const description = searchParams.get("description");
  const image = searchParams.get("image");

  const handleAddToCart = async () => {
    const item = { name, price, description, image };
    addToCart(item); // Update context
    toast.success(`${name} added to cart!`);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("You must be logged in to add items to cart");
      }

      const res = await fetch("https://coding-samurai-internship-production.up.railway.app/user/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Failed to add item to cart");
      }

      toast.success("Item added to backend cart!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-8">
        {/* Left Side: Image + Buttons */}
        <div className="flex flex-col items-center md:items-start">
          <div className="w-64 h-64 relative border rounded-lg overflow-hidden mb-4">
            <Image src={image} alt={name} fill className="object-cover" />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Order Now
            </button>
          </div>
        </div>

        {/* Right Side: Title + Description */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{name}</h1>
          <p className="text-blue-600 font-semibold text-lg mb-4">₹{price}</p>
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
}
