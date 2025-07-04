import { imageUrl } from "@/config";

interface PageProps {
  image: string;
  name: string;
}

export default function Category({ image, name }: PageProps) {
  return (
    <div
      className="
      w-full
      aspect-square
      flex flex-col
      items-center
      justify-between
      p-4
      border border-gray-200
      rounded-lg
      bg-white
      transition-all
      duration-300
      hover:border-green-600
      hover:shadow-md
      hover:text-green-700
      group
      overflow-hidden
    "
    >
      {/* Image Container */}
      <div
        className="
        w-full
        h-[70%]
        flex items-center justify-center
        overflow-hidden
        rounded-md
      "
      >
        {/* eslint-disable-next-line */}
        <img
          className="
            w-full h-full
            object-contain
            group-hover:scale-105
            transition-transform
            duration-500
          "
          src={`${imageUrl}${image}.jpg`}
          alt={name}
          loading="lazy"
        />
      </div>

      {/* Category Name */}
      <h3
        className="
        text-center
        text-sm sm:text-base
        font-semibold
        mt-2
        px-2
        line-clamp-2
      "
      >
        {name}
      </h3>
    </div>
  );
}
