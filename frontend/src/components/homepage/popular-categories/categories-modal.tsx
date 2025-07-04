"use client";

import { X } from "lucide-react";
import SmallCategory from "./small-category";
import { ICategory } from "@/interfaces/category.interface";

interface PageProps {
  isVisible: boolean;
  categories: ICategory[];
  onCategoryClick: (categoryId: number) => void;
  onClose: () => void;
}

export default function CategoriesModal({
  isVisible,
  categories,
  onCategoryClick,
  onClose,
}: PageProps) {
  if (!isVisible) return null;

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        overflow-y-auto p-4
      "
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="
        w-full max-w-6xl
        bg-white rounded-xl
        shadow-xl
        overflow-hidden
        animate-fade-in
      "
      >
        {/* Modal Header */}
        <div
          className="
          flex items-center justify-between
          p-4 sm:p-6
          border-b border-gray-100
          sticky top-0 bg-white z-10
        "
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            All Categories
          </h2>
          <button
            onClick={onClose}
            className="
              p-2 rounded-full
              text-gray-500 hover:text-gray-700
              hover:bg-gray-100
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
            aria-label="Close categories modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div
          className="
          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
          gap-3 sm:gap-4 md:gap-5
          p-4 sm:p-6
          overflow-y-auto
        "
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryClick(category.id);
                onClose();
              }}
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
              <SmallCategory image={category.image} name={category.name} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
