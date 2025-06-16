import { ArrowRight } from "lucide-react";
import Category from "./category";

export default function PopularCategories() {
  const categories = [
    {
      icon: "fresh-fruit",
      category: "Fresh Fruit",
    },
    {
      icon: "fresh-vegetables",
      category: "Fresh Vegetables",
    },
    {
      icon: "fresh-fruit",
      category: "Fresh Fruit",
    },
    {
      icon: "fresh-vegetables",
      category: "Fresh Vegetables",
    },
    {
      icon: "fresh-fruit",
      category: "Fresh Fruit",
    },
    {
      icon: "fresh-vegetables",
      category: "Fresh Vegetables",
    },
    {
      icon: "fresh-fruit",
      category: "Fresh Fruit",
    },
    {
      icon: "fresh-vegetables",
      category: "Fresh Vegetables",
    },
    {
      icon: "fresh-fruit",
      category: "Fresh Fruit",
    },
    {
      icon: "fresh-vegetables",
      category: "Fresh Vegetables",
    },
    {
      icon: "fresh-fruit",
      category: "Fresh Fruit",
    },
    {
      icon: "fresh-vegetables",
      category: "Fresh Vegetables",
    },
  ];

  return (
    <div className="w-[1320px] h-[520px] mt-[60px]">
      <div className="w-[1320px] h-[38px] flex items-center justify-between">
        <h1 className="text-[32px] font-semibold mb-8">Popular Categories</h1>
        <button className="w-[118px] h-[19px] text-[#00B207] text-[16px] font-semibold flex justify-center gap-1">
          View All <ArrowRight />
        </button>
      </div>
      <div className="w-[1320px] grid grid-cols-6 grid-rows-2 gap-6 mt-8">
        {categories.map((category, index) => (
          <Category
            key={index}
            icon={category.icon}
            category={category.category}
          />
        ))}
      </div>
    </div>
  );
}
