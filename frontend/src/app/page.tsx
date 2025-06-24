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

interface IProduct {
  id: number;
  categoryId: number;
}

interface IProducts {
  id: number;
  name: string;
  price: number;
  image: string;
  products: IProduct;
}

export default function Homepage() {
  const [coordinates, setCoordinates] = useState<ICoordinates>({
    latitude: 0,
    longitude: 0,
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
      });
  }, []);

  console.log(coordinates);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/categories/`
        );
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (coordinates.latitude !== 0 && coordinates.longitude !== 0) {
          const { data } = await axios.get(
            `http://localhost:8080/api/products/nearby?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`
          );
          setProducts(data.data);
        } else {
          const { data } = await axios.get(
            `http://localhost:8080/api/products/main`
          );
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [coordinates]);

  console.log(products);

  // Filter products based on the selected category
  const filteredProducts = selectedCategoryId
    ? products.filter((product: IProducts) => product.products.categoryId === selectedCategoryId)
    : products;

  // Handle category click
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <Navbar />
      <div className="px-[300px] pb-8">
        <Bannar />
        <Featured />
        <PopularCategories
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
        <PopularProducts products={filteredProducts} />
      </div>
      <div className="px-[300px] bg-[#1A1A1A]">
        <Footer />
      </div>
    </>
  );
}
