import { imageUrl } from "@/config";

interface PageProps {
  image: string;
  name: string;
}

export default function SmallCategory({ image, name }: PageProps) {
  return (
    <div
      className="
      w-full
      flex items-center
      gap-3 sm:gap-4
      p-2 sm:p-3
      border border-gray-200
      rounded-lg
      bg-white
      transition-all
      duration-200
      hover:border-green-600
      hover:shadow-sm
      hover:text-green-700
      group
      overflow-hidden
    "
    >
      {/* Image Container */}
      <div
        className="
        flex-shrink-0
        w-8 h-8 sm:w-10 sm:h-10
        rounded-md
        overflow-hidden
        bg-gray-50
        flex items-center justify-center
      "
      >
        {/* eslint-disable-next-line */}
        <img
          className="
            w-full h-full
            object-contain
            group-hover:scale-105
            transition-transform
            duration-300
          "
          src={`${imageUrl}${image}.jpg`}
          alt={name}
          loading="lazy"
        />
      </div>

      {/* Category Name */}
      <p
        className="
        text-sm sm:text-base
        font-semibold
        truncate
        text-left
        flex-1
      "
      >
        {name}
      </p>
    </div>
  );
}
