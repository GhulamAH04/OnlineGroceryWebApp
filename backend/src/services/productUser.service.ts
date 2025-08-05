// === FILE: backend/src/services/productUser.service.ts ===

import prisma from "../lib/prisma";

// === GET DETAIL PRODUK BERDASARKAN ID ===
export const GetAllProductsService = async () => {
  const products = await prisma.products.findMany({
    where: {
      product_branchs: {
        some: {},
      },
    },
    include: {
      categories: true,
      product_branchs: {
        include: {
          branchs: true,
        },
      },
    },
  });

  return products.map((p) => {
    const firstBranch = p.product_branchs[0];
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      weight: p.weight,
      image: p.image || "https://res.cloudinary.com/djbdfjx1d/image/upload/v1746972046/nugget_plgi8w.jpg",
      categoryName: p.categories?.name || "Unknown",
      branchId: firstBranch?.branchId || null,
      branchName: firstBranch?.branchs?.name || "Unknown",
      stock: firstBranch?.stock ?? 0,
    };
  });
};

// === GET DETAIL PRODUK BERDASARKAN ID ===
export const GetProductDetailService = async (id: number) => {
  const product = await prisma.products.findUnique({
    where: { id },
    include: {
      categories: true,
      product_branchs: {
        include: {
          branchs: true,
        },
      },
    },
  });

  if (!product) return null;

  const firstBranch = product.product_branchs[0];
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    weight: product.weight,
    image: product.image || "/product.jpg",
    categoryName: product.categories?.name || "Unknown",
    branchId: firstBranch?.branchId || null,
    branchName: firstBranch?.branchs?.name || "Unknown",
    stock: firstBranch?.stock ?? 0,
  };
};


// === GET STORES BERDASARKAN KOTA ===
async function getStoresByCity(city: string) {
  return prisma.branchs.findMany({
    where: {
      cities: {
        name: city.toUpperCase(),
      },
    },
  });
}

// === GET PRODUK DARI SATU CABANG ===
async function getProductBranchesByStoreId(storeId: number) {
  return prisma.product_branchs.findMany({
    where: {
      branchId: storeId,
    },
    include: {
      products: {
        include: {
          categories: true,
        },
      },
      branchs: true,
    },
  });
}

// === GET PRODUK BERDASARKAN KOTA USER (UNTUK HOMEPAGE) ===
export async function GetNearbyProductsService(userCity: string) {
  try {
    const stores = await getStoresByCity(userCity);
    const allProducts = await Promise.all(
      stores.map((store) => getProductBranchesByStoreId(store.id))
    );

    const productBranches = allProducts.flat();

    const result = productBranches.map((item) => ({
      id: item.products.id,
      name: item.products.name,
      slug: item.products.slug,
      image: item.products.image || "/product.jpg",
      price: item.products.price,
      description: item.products.description,
      weight: item.products.weight,
      stock: item.stock,
      branchId: item.branchs.id,
      branchName: item.branchs.name,
      categoryName: item.products.categories.name,
    }));

    return {
      userCity,
      products: result,
    };
  } catch (err) {
    console.error("❌ GetNearbyProductsService error:", err);
    throw err;
  }
}


/*
Nahalil
import prisma from "../lib/prisma";
import { getCityFromCoordinates } from "./city.service";

// === Get Produk Per Cabang ===
async function getProductBranchesByStoreId(storeId: number) {
  try {
    const productBranches = await prisma.product_branchs.findMany({
      where: {
        branchs: { id: storeId },
      },
      include: {
        products: true,
        branchs: true,
      },
    });
    return productBranches;
  } catch (err) {
    throw err;
  }
}

// === Ambil Semua Cabang di Kota Tertentu ===
async function getStoresByCity(city: string) {
  try {
    const branches = await prisma.branchs.findMany({
      where: {
        cities: {
          name: city.toUpperCase(),
        },
      },
    });
    return branches;
  } catch (err) {
    throw err;
  }
}
export async function GetNearbyProductsService(
  userCity: string
) {
  try {
    let productBranches = [];

    const stores = await getStoresByCity(userCity);
    for (let i = 0; i < stores.length; i++) {
      const storeId = stores[i].id;
      const product = await getProductBranchesByStoreId(storeId);
      productBranches.push(product);
    }

    const products = productBranches.flat();

    return { products, userCity };
  } catch (err) {
    throw err;
  }
}
*/