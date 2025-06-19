import Bannar from "@/components/bannar";
import DiscountBannar from "@/components/discount-bannar";
import Featured from "@/components/featured";
import Footer from "@/components/footer";
import HotDeals from "@/components/hot-deals";
import Navbar from "@/components/header";
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
      </div>
      <div className="h-[1171px] px-[300px] py-[60px] bg-[#F7F7F7]">
        <HotDeals />
      </div>
      <div className="px-[300px]">
        <DiscountBannar />
      </div>
      <div className="px-[300px] bg-[#1A1A1A]">
        <Footer />
      </div>
    </>
  );
}
