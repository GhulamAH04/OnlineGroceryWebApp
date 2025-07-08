'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { navbars } from '@/data/data';
import { FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { getCount } from '@/api/wishlist';
import { getCookies } from '@/helper/helper';

export const Header = (props: any) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const cookies = getCookies();

    const fetchCounts = async () => {
      const res = await getCount(Number(cookies.userId));

      setWishlistCount(res.data.wishlist);
      setCartCount(res.data.cart);
    };

    if (cookies.token && cookies.userId) {
      fetchCounts();
      setUser(JSON.parse(cookies.user));
    }
  }, []);
  const router = useRouter();
  const handleCartClick = () => {
    if (user.id) {
      router.push('/cart');
    } else {
      router.push('/auth/login');
    }
  };
  const handleWishlistClick = () => {
    if (user.id) {
      router.push('/wishlist');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <header className="grid grid-cols-2 md:grid-cols-3 md:px-40 px-4 items-center justify-between bg-black sticky top-0 z-50 text-white">
      <div className="py-2">
        <Link href="/">
          <Image src="/logo-white.png" alt="Groceria" width={150} height={25} />
        </Link>
      </div>
      <div className="md:hidden flex justify-end py-2">
        <button
          className="flex items-center rounded border-2 border-white px-3 py-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-3 w-3 fill-current text-white"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:block md:col-span-1 col-span-2 py-4 md:py-0 justify-self-center`}
      >
        <nav>
          <ul className="flex flex-col md:flex-row md:space-x-4 md:gap-8 gap-4 text-center">
            {navbars.map((navbar) => (
              <li key={navbar.id}>
                <Link
                  href={navbar.link}
                  className={pathname === navbar.link ? 'active' : 'nav-link'}
                >
                  {navbar.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* mobile */}
        {isMounted && (
          <div className="md:hidden flex flex-col mt-4 gap-6 justify-self-end items-center">
            <Link href={user.username ? '/profile' : '/auth/login'}>
              {user.username ? (
                <div className="flex gap-2">
                  <Image
                    src={
                      user.image
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/profile/${user.image}`
                        : '/user.png'
                    }
                    alt="user"
                    width={50}
                    height={50}
                    className="rounded-full h-10 w-10"
                  />
                  <div className="content-center text-xs hover:font-bold">
                    Hello, <br /> {user.username}
                  </div>
                </div>
              ) : (
                <div className="bg-secondary px-4 py-1 rounded-md text-black text-sm hover:font-bold">
                  Sign In
                </div>
              )}
            </Link>
            <div className="flex gap-8">
              <div className="relative">
                <Link href={'/wishlist'}>
                  <FaRegHeart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 left-4 mt-[-5px] rounded-full bg-red-500 text-white text-xs px-2">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>
              <div className="relative">
                <Link href={'/cart'}>
                  <FaShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 left-4 mt-[-5px] rounded-full bg-red-500 text-white text-xs px-2">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* desktop */}
      {isMounted && (
        <div className="hidden md:flex gap-6 justify-self-end items-center">
          <Link href={user.username ? '/profile' : '/auth/login'}>
            {user.username ? (
              <div className="flex gap-2">
                <Image
                  src={
                    user.image
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/profile/${user.image}`
                      : '/user.png'
                  }
                  alt="user"
                  width={50}
                  height={50}
                  className="rounded-full h-10 w-10"
                />
                <div className="content-center text-xs hover:font-bold">
                  Hello, <br /> {user.username}
                </div>
              </div>
            ) : (
              <div className="bg-secondary px-4 py-1 rounded-md text-black text-sm hover:font-bold">
                Sign In
              </div>
            )}
          </Link>
          <div className="relative">
            <button onClick={handleWishlistClick}>
              <FaRegHeart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 left-4 mt-[-5px] rounded-full bg-red-500 text-white text-xs px-2">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
          <div className="relative">
            <button onClick={handleCartClick}>
              <FaShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 left-4 mt-[-5px] rounded-full bg-red-500 text-white text-xs px-2">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
