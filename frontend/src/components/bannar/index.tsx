import BigBanner from "./big-bannar";
import SmallBanner1 from "./small-bannar1";
import SmallBanner2 from "./small-bannar2";

export default function Banner() {
  return (
    <div className="w-full max-w-screen-2xl mx-auto py-4">
      {/* Mobile Carousel */}
      <div className="lg:hidden overflow-x-auto pb-4 px-4 scroll-smooth snap-x snap-mandatory">
        <div className="inline-flex gap-4 w-max">
          <div className="w-[90vw] inline-block snap-center">
            <BigBanner />
          </div>
          <div className="w-[90vw] inline-block snap-center">
            <SmallBanner1 />
          </div>
          <div className="w-[90vw] inline-block snap-center">
            <SmallBanner2 />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Main Banner */}
        <div className="w-full lg:w-2/3 h-auto">
          <BigBanner />
        </div>

        {/* Side Banners */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-6">
          <div className="w-full aspect-[423/288]">
            <SmallBanner1 />
          </div>
          <div className="w-full aspect-[423/288]">
            <SmallBanner2 />
          </div>
        </div>
      </div>
    </div>
  );
}
