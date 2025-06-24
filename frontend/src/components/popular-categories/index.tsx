import { ArrowRight } from "lucide-react";
import Category from "./category";

interface ICategory {
  id: string;
  slug: string;
  name: string;
  image: string;
}

interface props {
  categories: ICategory[];
}

export default function PopularCategories({ categories }: props ) {
  const displayedCategories = categories.slice(0, 6);

  return (
    <div className="w-[1320px] mt-[60px]">
      <div className="w-[1320px] h-[38px] flex items-center justify-between">
        <h1 className="text-[32px] font-semibold">Popular Categories</h1>
        <button className="w-[118px] h-[19px] text-[#00B207] text-[16px] font-semibold flex justify-center gap-1">
          View All <ArrowRight />
        </button>
      </div>
      <div className="w-[1320px] grid grid-cols-6 gap-6 mt-8">
        {displayedCategories.map((category, index) => (
          <Category
            key={index}
            image={category.image}
            name={category.name}
          />
        ))}
      </div>
    </div>
  );
}
