"use client";

import { useItemContext } from "@/context/ItemContext";
import ProductCard from "@/components/productCard";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartItems, clearCartFromContext } = useItemContext();

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return toast.error("You must be logged in to clear your cart.");
      }

      const res = await fetch("http://localhost:5000/user/clearCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Failed to clear cart.");
      }

      clearCartFromContext(); // update frontend context
      toast.success("Cart cleared successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while clearing your cart.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleClearCart}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
