"use client";

import Bannar from "@/components/homepage/bannar";
import Featured from "@/components/homepage/featured";
import PopularCategories from "@/components/homepage/popular-categories";
import CategoriesModal from "@/components/homepage/popular-categories/categories-modal";
import PopularProducts from "@/components/homepage/popular-products";
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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
      });
  }, []);

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

  // Filter products based on the selected category
  const filteredProducts = selectedCategoryId
    ? products.filter(
        (product: IProducts) =>
          product.products.categoryId === selectedCategoryId
      )
    : products;

  // Handle category click
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <div className="2xl:px-[300px] xl:px-[150px] 2xl:pb-8 xl:pb-4">
        <Bannar />
        <Featured />
        <PopularCategories
          categories={categories}
          onCategoryClick={handleCategoryClick}
          onViewAllClick={() => setShowCategories(true)}
        />
        <PopularProducts products={filteredProducts} />
      </div>
      <CategoriesModal
        isVisible={showCategories}
        categories={categories}
        onClose={() => setShowCategories(false)}
        onCategoryClick={handleCategoryClick}
      />
    </>
  );
}
