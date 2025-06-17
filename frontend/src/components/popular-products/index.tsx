import { ArrowRight } from "lucide-react";
import Product from "./product";

export default function Populartitles() {
  const products = [
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
    {
      icon: "apple",
      title: "Green Apple",
    },
  ];

  return (
    <div className="w-[1320px] h-[714px] mt-[60px]">
      <div className="w-[1320px] h-[38px] flex items-center justify-between">
        <h1 className="text-[32px] font-semibold">Popular Products</h1>
        <button className="w-[118px] h-[19px] text-[#00B207] text-[16px] font-semibold flex justify-center gap-1">
          View All <ArrowRight />
        </button>
      </div>
      <div className="w-[1320px] grid grid-cols-5 grid-rows-2 gap-0 mt-8">
        {products.map((product, index) => (
          <Product
            key={index}
            icon={product.icon}
            title={product.title}
          />
        ))}
      </div>
    </div>
  );
}
