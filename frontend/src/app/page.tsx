"use client";

import Bannar from "@/components/bannar";
import Featured from "@/components/featured";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import PopularCategories from "@/components/popular-categories";
import PopularProducts from "@/components/popular-products";
import { ICoordinates } from "@/interfaces/location.interface";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [coordinates, setCoordinates] = useState<ICoordinates>({
    latitude: 0,
    longitude: 0,
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
      });
  }, []);

  console.log(coordinates);

  useEffect(() => {
    const fetchProducts = async () => {
      if (coordinates.latitude !== 0 && coordinates.longitude !== 0) {
        try {
          const { data } = await axios.get(
            `http://localhost:8080/api/products/nearby?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
          );
          setProducts(data.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchProducts();
  }, [coordinates]);

  console.log(products);

  return (
    <>
      <Navbar />
      <div className="px-[300px] pb-8">
        <Bannar />
        <Featured />
        <PopularCategories />
        <PopularProducts products={products} />
      </div>
      <div className="px-[300px] bg-[#1A1A1A]">
        <Footer />
      </div>
    </>
  );
}
