import { ArrowRight } from "lucide-react";
import Category from "./category";

interface ICategory {
  id: number;
  slug: string;
  name: string;
  image: string;
}

interface props {
  categories: ICategory[];
  onCategoryClick: (categoryId: number) => void;
}

export default function PopularCategories({ categories, onCategoryClick }: props ) {
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
        {displayedCategories.map((category) => (
          <div key={category.id} onClick={() => onCategoryClick(category.id)}>
            <Category image={category.image} name={category.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
