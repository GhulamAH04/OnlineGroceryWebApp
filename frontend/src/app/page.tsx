import Bannar from "@/components/bannar";
import Bannar2 from "@/components/bannar2";
import DiscountBannar from "@/components/discount-bannar";
import Featured from "@/components/featured";
import HotDeals from "@/components/hot-deals";
import Navbar from "@/components/navigation";
import PopularCategories from "@/components/popular-categories";
import PopularProducts from "@/components/popular-products";

export default function Homepage() {
  return (
    <>
      <Navbar />
      <div className="px-[300px]">
        <Bannar />
        <Featured />
        <PopularCategories />
        <PopularProducts />
        <Bannar2 />
      </div>
      <div className="h-[1171px] px-[300px] py-[60px] bg-[#F7F7F7]">
        <HotDeals/>
      </div>
      <div className="px-[300px]">
        <DiscountBannar/>
      </div>
    </>
  );
}
