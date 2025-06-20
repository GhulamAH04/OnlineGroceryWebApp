"use client"

import Bannar from "@/components/bannar";
import Featured from "@/components/featured";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import PopularCategories from "@/components/popular-categories";
import PopularProducts from "@/components/popular-products";
import LocationPopUp from "@/components/location-pop-up";
import { useState } from "react";

export default function Homepage() {
const [showPopUp, setShowPopUp] = useState(true);
  return (
    <>
      <Navbar />
      <div className="px-[300px] pb-8">
        <Bannar />
        <Featured />
        <PopularCategories />
        <PopularProducts />
      </div>
      <div className="px-[300px] bg-[#1A1A1A]">
        <Footer />
      </div>
      <LocationPopUp
        isVisible={showPopUp}
        onClose={() => setShowPopUp(false)}
      />
    </>
  );
}
