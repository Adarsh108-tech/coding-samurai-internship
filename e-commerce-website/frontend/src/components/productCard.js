"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const slug = product.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      href={{
        pathname: `/product/${slug}`,
        query: { // Passing data via query
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
        },
      }}
    >
      <div className="w-full max-w-md bg-white shadow-md rounded-xl overflow-hidden flex items-center p-4 hover:shadow-lg transition cursor-pointer">
        <div className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden border border-gray-200">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-blue-600 font-bold mt-1">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
}
