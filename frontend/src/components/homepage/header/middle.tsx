import { useAppSelector } from "@/lib/redux/hooks";
import { TotalCartResponse, useCartStore } from "@/stores/cart.store";
import { Heart, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Middle() {
  const { totalCart, isLoading } = useCartStore();
  const userState = useAppSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState<TotalCartResponse>();

  const getTotalCart = async () => {
    try {
      const total = await totalCart();
      console.log("Total Cart:", total);
      setCartItems(total);
    } catch (error) {
      console.error("Failed to fetch total cart:", error);
    }
  };

  useEffect(() => {
    if (userState.user.username) {
      getTotalCart();
    } else {
      setCartItems(undefined);
    }
  }, [userState, isLoading]);

  return (
    <div className="w-full">
      <div
        className="
        w-full
        flex flex-col md:flex-row
        items-center
        justify-between
        gap-1 sm:gap-6
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[150px] 2xl:px-[300px]
        py-4 sm:py-5 md:py-6
        border-b border-neutral-100
      "
      >
        <div className="flex items-center gap-2 w-full md:w-auto">
          <img
            className="w-7 h-7 sm:w-8 sm:h-8"
            src="/navigation/plant.svg"
            alt="Ecobazar logo"
          />
          <p className="font-semibold text-2xl sm:text-3xl xl:text-[32px] text-black">
            Ecobazar
          </p>
          {/* Cart/Wishlist - display on mobile */}
          <div className="flex md:hidden items-center gap-4 sm:gap-6 w-full md:w-auto justify-end">
            <Heart
              className="
            w-6 h-6 xl:w-[30px] xl:h-[30px]
            text-neutral-700
            hover:text-red-500
            transition-colors
          "
            />
            <div className="flex items-center gap-3">
              <div className="relative">
                <Link href={"/cart"} className="flex items-center">
                  <Image
                    className="w-7 h-7 xl:w-8 xl:h-8"
                    src="/navigation/bag.svg"
                    alt="Shopping cart"
                    width={32}
                    height={32}
                    loading="lazy"
                  />
                </Link>
                <div
                  className="
                absolute -top-1 -right-1
                bg-green-700
                rounded-full
                w-4 h-4
                text-white
                text-[10px]
                flex items-center justify-center
              "
                >
                  {cartItems ? cartItems.totalQuantity : 0}
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-neutral-500">Shopping Cart:</p>
                <p className="text-sm font-medium">
                  IDR {cartItems ? cartItems.totalPrice : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar - Below on mobile, between on desktop */}
        <div
          className="
          w-full md:w-[35rem] md:flex
          order-last md:justify-center md:items-center md:order-none
          mt-4 md:mt-0
          px-4 md:px-0
        "
        >
          <div
            className="
            w-full max-w-[500px] md:mx-4
            h-10 xl:h-[45px]
            border border-neutral-200
            rounded-md
            overflow-hidden
            flex
          "
          >
            <div className="flex items-center gap-2 pl-3 w-full">
              <Search className="text-neutral-700 w-4 h-4 xl:w-5 xl:h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                className="
                  w-full h-full
                  text-sm xl:text-base
                  focus:outline-none
                  placeholder:text-neutral-400
                "
              />
            </div>
            <button
              className="
              bg-green-600 hover:bg-green-700
              text-white
              w-20 xl:w-[98px]
              h-full
              transition-colors
              flex items-center justify-center
              text-sm xl:text-base
            "
            >
              Search
            </button>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-end">
          <Heart
            className="
            w-6 h-6 xl:w-[30px] xl:h-[30px]
            text-neutral-700
            hover:text-red-500
            transition-colors
          "
          />
          <div className="flex items-center gap-3">
            <div className="relative">
              <Link href={"/cart"} className="flex items-center">
                <Image
                  className="w-7 h-7 xl:w-8 xl:h-8"
                  src="/navigation/bag.svg"
                  alt="Shopping cart"
                  width={32}
                  height={32}
                  loading="lazy"
                />
              </Link>
              <div
                className="
                absolute -top-1 -right-1
                bg-green-700
                rounded-full
                w-4 h-4
                text-white
                text-[10px]
                flex items-center justify-center
              "
              >
                {cartItems ? cartItems.totalQuantity : 0}
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-neutral-500">Shopping Cart:</p>
              <p className="text-sm font-medium">
                IDR {cartItems ? cartItems.totalPrice : 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
