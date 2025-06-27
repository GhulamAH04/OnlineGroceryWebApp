import ShopButton from "../../shop-button";

export default function BigBanner() {
  return (
    <section className="relative w-full h-full aspect-[872/600] rounded-[10px] overflow-hidden">
      {/* Banner Image */}
      {/* eslint-disable-next-line */}
      <img
        src="/bannar/big-bannar.jpg"
        alt="Fresh organic fruits and vegetables"
        className="w-full h-full object-cover absolute inset-0"
      />

      {/* Content Overlay */}
      <div
        className="
        relative z-10
        h-full
        flex flex-col
        justify-center
        px-6 sm:px-8 md:px-12 lg:px-16 xl:px-[60px]
        py-8 sm:py-12
      "
      >
        <div
          className="
          max-w-[500px] lg:max-w-[596px]
          space-y-4 sm:space-y-5 md:space-y-6
          text-white
        "
        >
          <h1
            className="
            sm:w-[30rem] w-[12rem]
            font-bold
            text-xl sm:text-4xl md:text-5xl
            leading-tight
          "
          >
            Fresh & Healthy Organic Food
          </h1>

          {/* Discount Badge Section */}
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-4xl sm:text-5xl md:text-[65px] text-green-300">
              |
            </span>
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <p className="text-lg sm:text-xl">Sale up to</p>
                <div
                  className="
                  bg-orange-500
                  text-white
                  text-lg sm:text-xl
                  px-3 py-1
                  rounded-[5px]
                  whitespace-nowrap
                "
                >
                  30% OFF
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/90">
                Free shipping on all your order.
              </p>
            </div>
          </div>

          {/* Shop Button */}
          <div className="pt-2 sm:pt-4 ">
            <ShopButton />
          </div>
        </div>
      </div>
    </section>
  );
}
