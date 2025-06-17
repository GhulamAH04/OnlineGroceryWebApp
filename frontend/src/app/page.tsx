import Bannar from "@/components/bannar";
import Featured from "@/components/featured";
import Navbar from "@/components/navigation";
import PopularCategories from "@/components/popular-categories";
import PopularProducts from "@/components/popular-products";

export default function Homepage() {
  return (
    <>
      <Navbar/>
      <div className="px-[300px]">
        <Bannar/>
        <Featured/>
        <PopularCategories/>
        <PopularProducts/>
      </div>
    </>
  );
}
