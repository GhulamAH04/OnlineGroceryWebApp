"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getCategories } from "@/lib/data";
import { apiUrl } from "@/config";
import Featured from "@/components/homepage/featured";
import PopularCategories from "@/components/homepage/popular-categories";
import PopularProducts from "@/components/homepage/popular-products";
import CategoriesModal from "@/components/homepage/popular-categories/categories-modal";
import Banner from "@/components/homepage/bannar";
import { IProductBranch } from "@/interfaces/product.interface";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setCity } from "@/lib/redux/features/locationSlice";

export default function Homepage() {
  const dispatch = useAppDispatch();
  // redux state
  const location = useAppSelector((state) => state.location);

  // local state
  const [branchesProducts, setBranchesProducts] = useState<IProductBranch[]>(
    []
  );
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showCategories, setShowCategories] = useState(false);

  // Effect to get user's initial coordinates
  const getCity = async (latitude: number, longitude: number) => {
    const response = await axios.get(
      `${apiUrl}/api/cities?latitude=${latitude}&longitude=${longitude}`
    );
    dispatch(setCity({city: response.data.data}));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (latitude && longitude) getCity(latitude, longitude);
      });
    }
  });

  // Effect to fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Effect to fetch products and city based on coordinates
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/api/products/nearby/${location.city}`
        );
        const products = data.data.products;
        if (products.length > 0) setBranchesProducts(products);
      } catch (err) {
        console.error("Error fetching nearby products:", err);
      }
    };

    if (location.city) fetchProducts();
  }, [location.city]);

  // Filter products based on the selected category
  const filteredProducts = selectedCategoryId
    ? branchesProducts.filter(
        (product: IProductBranch) =>
          product.products.categoryId === selectedCategoryId
      )
    : branchesProducts;

  // Handle category click
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <div className="2xl:px-[300px] xl:px-[150px] 2xl:pb-8 xl:pb-4">
        <Banner />
        <Featured />
        <PopularCategories
          categories={categories}
          onCategoryClick={handleCategoryClick}
          onViewAllClick={() => setShowCategories(true)}
        />
        {branchesProducts.length > 0 ? (
          <PopularProducts products={filteredProducts} />
        ) : (
          "Loading products..."
        )}
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
