import { ArrowRight } from "lucide-react";
import BigProduct from "./big-product";
import Product from "../popular-products/product";

export default function HotDeals() {
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
    <div className="w-[1320px] h-[714px]">
      <div className="w-[1320px] h-[38px] flex items-center justify-between">
        <h1 className="text-[32px] font-semibold">Hot Deals</h1>
        <button className="w-[118px] h-[19px] text-[#00B207] text-[16px] font-semibold flex justify-center gap-1">
          View All <ArrowRight />
        </button>
      </div>
      <div className="w-[1320px] grid grid-cols-5 grid-rows-3 gap-0 mt-8">
        <div className="w-[524px] h-[654px] col-span-2 row-span-2">
          <BigProduct />
        </div>
        {products.map((product, index) => (
          <Product key={index} icon={product.icon} title={product.title} />
        ))}
      </div>
    </div>
  );
}
