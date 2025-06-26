interface Props {
  icon: string;
  title: string;
  desc: string;
}

export default function Feature({ icon, title, desc }: Props) {
  return (
    <div
      className={`
      flex items-center
      gap-3 sm:gap-4
      p-3 sm:p-4
      rounded-lg
      hover:bg-gray-50
      hover:scale-[1.02]
      transition-all duration-200
    `}
    >
      <div
        className="
        flex-shrink-0
        w-10 h-10
        flex items-center justify-center
        bg-green-100/50
        rounded-full
      "
      >
        {/* eslint-disable-next-line */}
        <img
          className="w-5 h-5 sm:w-6 sm:h-6"
          src={`/featured/${icon}.svg`}
          alt=""
          aria-hidden="true"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className="
          text-sm sm:text-base
          font-semibold
          text-gray-900
          truncate
        "
        >
          {title}
        </h3>
        <p
          className="
          text-xs sm:text-sm
          text-gray-500
          mt-0.5
          line-clamp-2
        "
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
