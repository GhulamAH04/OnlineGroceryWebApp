import { Categories } from '@/interface/category.interface';
import React from 'react';

interface CategoryProps {
  onSortChange: (sortConfig: string | null) => void;
  categories: Categories[];
}

const Category: React.FC<CategoryProps> = ({ onSortChange, categories }) => {
  const handleSort = (sortBy: number | null) => {
    let category = '';

    if (sortBy === null) {
      category = '';
    } else {
      switch (sortBy) {
        case 1:
          category = 'fruits';
          break;
        case 2:
          category = 'vegetables';
          break;
        case 3:
          category = 'meat';
          break;
        case 4:
          category = 'processed ingredients';
          break;
        default:
          category = '';
          break;
      }
    }

    onSortChange(category === '' ? null : category);
  };

  return (
    <div className="flex justify-center py-8 gap-9">
      <div className="flex flex-col justify-center items-center sm:flex-row sm:space-x-12 space-y-4 sm:space-y-0">
        {/* All Categories Button */}
        <div className="hover:font-semibold">
          <div
            className="border py-1 border-gray-900 rounded-2xl inline-flex items-center justify-center cursor-pointer transition duration-300 ease-in-out transform hover:font-semibold w-auto"
            onClick={() => handleSort(null)}
          >
            <span className="px-3 py-1 text-black hover:font-semibold">
              All Categories
            </span>
          </div>
        </div>

        {/* Category Buttons */}
        {categories && categories.length > 0 ? (
          categories.map((category, index) => (
            <div key={index} className="hover:font-semibold">
              <div
                className="border py-1 border-gray-900 rounded-2xl inline-flex items-center justify-center cursor-pointer transition duration-300 ease-in-out transform hover:font-semibold w-auto"
                onClick={() => handleSort(category.id)}
              >
                <span className="px-3 py-1 text-black hover:font-semibold">
                  {category.name}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div>No categories found</div>
        )}
      </div>
    </div>
  );
};

export default Category;
