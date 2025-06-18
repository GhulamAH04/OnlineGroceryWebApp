import ShopButton from "../shop-button";

export default function BigBannar() {
  return (
    <>
      {/* eslint-disable-next-line */}
      <img
        src="/bannar/big-bannar.jpg"
        alt="big-bannar"
        className="rounded-[10px] w-[872px] h-[600px] absolute"
      />
      <div className="w-[596px] h-[290px] flex flex-col justify-center gap-7 text-white relative top-[155px] left-[60px]">
        <p className="font-bold text-5xl w-[75%]">
          Fresh & Healthy Organic Food
        </p>
        <div className="w-[275px] h-[67px] flex items-center gap-3">
          <p className="text-[65px] text-[#84D187]">|</p>
          <div className="w-[217px] h-[67px] flex flex-col gap-2">
            <div className="flex gap-2 items-center w-full">
              <p className="w-[101px] text-[20px]">Sale up to</p>
              <div className="bg-[#FF8A00] w-[125px] h-[38px] text-white text-xl text-center px-3 py-1 rounded-[5px]">
                <p>30% OFF</p>
              </div>
            </div>
            <p className="text-sm">Free shipping on all your order.</p>
          </div>
        </div>
        <ShopButton background="#FFFFFF" textColour="#00B207" />
      </div>
    </>
  );
}
