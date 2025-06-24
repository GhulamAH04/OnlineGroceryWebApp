import { ArrowRight } from "lucide-react";
import Product from "./product";

interface IProduct {
  id: string;
  products: {
    image: string;
    name: string;
    price: number;
  };
}

interface props {
  products: IProduct[];
}

export default function PopularProducts({ products }: props) {
  const displayedProducts = products.slice(0, 10);

  return (
    <div className="w-[1320px] mt-[60px]">
      <div className="w-[1320px] h-[38px] flex items-center justify-between">
        <h1 className="text-[32px] font-semibold">Popular Products</h1>
        <button className="w-[118px] h-[19px] text-[#00B207] text-[16px] font-semibold flex justify-center gap-1">
          View All <ArrowRight />
        </button>
      </div>
      <div className="w-[1320px] grid grid-cols-5 gap-0 mt-8">
        {displayedProducts.map((product) => (
          <Product
            key={product.id}
            image={product.products.image}
            name={product.products.name}
            price={product.products.price}
          />
        ))}
      </div>
    </div>
  );
}
