import { navbars } from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-black p-8 text-white my-6">
      <div className="grid md:grid-cols-5 sm:grid-cols-1 gap-4 max-w-screen-xl mx-auto">
        <div className="col-span-2 px-6">
          <Image src="/logo-white.png" alt="groceria" width={250} height={25} />
          <p className="mt-4 text-justify">
            Groceria is your trusted platform for sourcing fresh groceries
            online. Explore and shop for a wide range of fresh produce, daily
            essentials, and pantry staples with ease and confidence. Whether you
            need farm-fresh vegetables, dairy products, or specialty
            ingredients, Groceria ensures that everything is delivered fresh,
            straight to your doorstep. Shop smart, eat fresh, and smile more
            with Groceria.
          </p>
        </div>
        <div className="px-6">
          <h3 className="text-2xl font-bold mt-3">Menu</h3>
          <ul className="mt-2">
            {navbars.map((item, index) => (
              <li key={index}>
                <Link href={item.link} className="nav-link">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 px-6">
          <h3 className="text-2xl font-bold mt-3">Information Contact</h3>
          <p className="mt-2">
            Address: Jl Tebet Barat Dalam Raya No. 3, Jakarta Selatan
          </p>
          <p>Email: info@groceria.com</p>
          <p>Phone: +62 123 456 789</p>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>© 2024 Groceria. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
