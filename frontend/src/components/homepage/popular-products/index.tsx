import { ArrowRight } from "lucide-react";
import Product from "./product";
import Link from "next/link";

interface IProduct {
  id: string;
  products: {
    image: string;
    name: string;
    price: number;
  };
}

interface Props {
  products: IProduct[];
}

export default function PopularProducts({ products }: Props) {
  const displayedProducts = products.slice(0, 10);

  return (
    <section className="w-full max-w-[1320px] mx-auto mt-12 lg:mt-[60px] px-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-gray-900">
          Popular Products
        </h2>
        <Link
          href="/shop"
          className="
            text-green-600 hover:text-green-700
            text-sm sm:text-base
            font-semibold
            flex items-center gap-1
            transition-colors
            group
          "
          aria-label="View all products"
        >
          View All
          <ArrowRight
            className="
            w-4 h-4
            transition-transform
            group-hover:translate-x-1
          "
          />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {displayedProducts.map((product) => (
          <Product
            key={product.id}
            image={product.products.image}
            name={product.products.name}
            price={product.products.price}
          />
        ))}
      </div>
    </section>
  );
}
