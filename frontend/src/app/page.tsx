"use client";

import Bannar from "@/components/homepage/bannar";
import Featured from "@/components/homepage/featured";
import PopularCategories from "@/components/homepage/popular-categories";
import CategoriesModal from "@/components/homepage/popular-categories/categories-modal";
import PopularProducts from "@/components/homepage/popular-products";
import { ILocation } from "@/interfaces/location.interface";
import { IProductBranch } from "@/interfaces/product.interface";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import { setCity, setCoordinates } from "@/lib/redux/features/locationSlice";
import { setCookie } from "cookies-next";
import sign from "jwt-encode";
import { jwtSecret } from "@/config";
import { getCategories, getMainProducts, getNearbyProducts } from "@/lib/data";

export default function Homepage() {
  // hook
  const dispatch = useAppDispatch();

  // state in redux
  const location = useAppSelector((state) => state.location);

  // local state
  const [branchesProducts, setBranchesProducts] = useState<IProductBranch[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const locationState: ILocation = {
          latitude,
          longitude,
          city: ""
        } 
        dispatch(setCoordinates(locationState));
      });
  }, [dispatch]);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (location.latitude !== 0 && location.longitude !== 0) {
          const data = await getNearbyProducts(location.latitude, location.longitude);
          setBranchesProducts(data.products);
          const locationState: ILocation = {
            latitude: location.latitude,
            longitude: location.longitude,
            city: data.data.userCity
          };
          // set location cookie
          const token = sign(locationState, `${jwtSecret}`);
          setCookie("location_token", token)

          dispatch(setCity(locationState));
        } else {
          const data = await getMainProducts()
          setBranchesProducts(data.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [location, dispatch]);

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
