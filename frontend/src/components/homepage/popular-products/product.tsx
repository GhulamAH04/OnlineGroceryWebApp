// OnlineGroceryWebApp/frontend/src/components/homepage/popular-products/product.tsx

"use client";

import { EyeIcon, Heart, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cart.store";

interface PageProps {
  productId?: number;
  image: string;
  name: string;
  price: number;
}

export default function Product({ image, name, price, productId }: PageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isLoading } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // ⛔️ agar klik tidak ikut trigger link
    if (typeof productId === "number") {
      addToCart(productId, 1);
    }
  };

  return (
    <Link href={`/products/${productId}`} passHref>
      <article
        className="
          w-full
          bg-white
          border border-gray-200
          rounded-lg
          overflow-hidden
          transition-all
          duration-300
          hover:border-green-600
          hover:shadow-md
          group
          cursor-pointer
        "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gambar Produk */}
        <div className="relative aspect-square overflow-hidden">
          <img
            className="
              w-full h-full
              object-contain
              p-4
              transition-transform
              duration-500
              group-hover:scale-105
            "
            src={image}
            alt={name}
            loading="lazy"
          />

          {isHovered && (
            <div className="absolute top-3 right-3 space-y-2">
              <button
                className="
                  w-10 h-10
                  bg-white/90 backdrop-blur-sm
                  rounded-full
                  flex items-center justify-center
                  text-gray-700 hover:text-green-600
                  shadow-sm
                  transition-all
                "
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                className="
                  w-10 h-10
                  bg-white/90 backdrop-blur-sm
                  rounded-full
                  flex items-center justify-center
                  text-gray-700 hover:text-green-600
                  shadow-sm
                  transition-all
                "
                aria-label="Quick view"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Info Produk */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm text-gray-700 line-clamp-2">{name}</h3>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= 4
                    ? "fill-yellow-500 text-yellow-500"
                    : "fill-gray-300 text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-base font-semibold text-gray-900">
              IDR {price.toLocaleString()}
            </span>
            <button
              className="
                w-10 h-10
                bg-gray-100 hover:bg-green-600
                rounded-full
                flex items-center justify-center
                text-gray-700 hover:text-white
                transition-colors
              "
              aria-label="Add to cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart
                className={`w-5 h-5 ${isLoading ? "cursor-not-allowed" : ""}`}
              />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
