import ShopButton from "../shop-button";

export default function DiscountBannar() {
  return (
    <div className="w-[1320px] h-[358px] my-[60px]">
      {/* eslint-disable-next-line */}
      <img
        className="w-[1320px] h-[358px] rounded-[10px] absolute"
        src="/discount-bannar/discount-bannar.jpg"
        alt="discount-bannar"
      />
      <div className="w-[441px] h-[250px] flex flex-col relative top-[60px] left-[850px]">
        <div className="w-[441px] h-[95px]">
          <p className="text-[#FFFFFF] text-[14px] tracking-[2px] font-medium ">
            Summer Sale
          </p>
          <p className="text-[56px] text-[#FFFFFF] font-medium flex">
            <span className="text-[#FF8A00]">37%</span> OFF
          </p>
          <p className="w-[400px] text-[#FFFFFF90] text-[16px] font-normal mb-4">
            Free on all your order, Free Shipping and 30 days money-back
            guarantee
          </p>
          <div className="w-[290px] h-[52px] mb-6 flex">
            <ShopButton background="#00B207" textColour="#FFFFFF" />
          </div>
        </div>
      </div>
    </div>
  );
}
