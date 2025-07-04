import { ArrowRight } from "lucide-react";
import Category from "./category";
import { ICategory } from "@/interfaces/category.interface";

interface PageProps {
  categories: ICategory[];
  onCategoryClick: (categoryId: number) => void;
  onViewAllClick: () => void;
}

export default function PopularCategories({
  categories,
  onCategoryClick,
  onViewAllClick,
}: PageProps) {
  const displayedCategories = categories.slice(0, 6);

  return (
    <section className="w-full max-w-[1320px] mt-12 lg:mt-[60px] px-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-gray-900">
          Popular Categories
        </h2>
        <button
          onClick={onViewAllClick}
          className="
            text-green-600 hover:text-green-700
            text-sm sm:text-base
            font-semibold
            flex items-center gap-1
            transition-colors
            group
          "
          aria-label="View all categories"
        >
          View All
          <ArrowRight
            className="
            w-4 h-4
            transition-transform
            group-hover:translate-x-1
          "
          />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {displayedCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className="
              text-left
              focus:outline-none
              focus:ring-2 focus:ring-green-500/50
              rounded-lg
              transition-transform
              hover:scale-[1.02]
            "
            aria-label={`Browse ${category.name} category`}
          >
            <Category image={category.image} name={category.name} />
          </button>
        ))}
      </div>
    </section>
  );
}
