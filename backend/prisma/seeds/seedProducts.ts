// === FILE: prisma/seeds/seedProducts.ts ===
import { PrismaClient } from "@prisma/client";

export const seedProducts = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding products...");

  const categories = await prisma.categories.findMany();
  const branches = await prisma.branchs.findMany(); // ambil semua cabang
  const now = new Date();

  // Clear existing products and stocks
  await prisma.order_products.deleteMany();
  await prisma.product_branchs.deleteMany();
  await prisma.products.deleteMany();

  // === DATA PRODUK ===
  const productMap: Record<string, {
    name: string;
    description: string;
    price: number;
    image: string;
    weight: number;
  }[]> = {
    "Sayur Segar": [
      {
        name: "Bayam Segar",
        description: "Bayam hijau segar siap masak.",
        price: 5000,
        image: "https://res.cloudinary.com/demo/image/upload/bayam.jpg",
        weight: 100,
      },
      {
        name: "Wortel Lokal",
        description: "Wortel manis cocok untuk sup.",
        price: 6000,
        image: "wortel_kncze8.jpg",
        weight: 100,
      },
      {
        name: "Kol Putih",
        description: "Kol segar untuk tumisan.",
        price: 7000,
        image: "https://res.cloudinary.com/demo/image/upload/kolputih.jpg",
        weight: 100,
      },
    ],
    "Buah Segar": [
      {
        name: "Pisang Cavendish",
        description: "Pisang manis kaya potasium.",
        price: 15000,
        image: "https://res.cloudinary.com/demo/image/upload/pisang.jpg",
        weight: 100,
      },
      {
        name: "Apel Fuji",
        description: "Apel merah renyah dari Jepang.",
        price: 25000,
        image: "apel-fuji_cvfvsx.jpg",
        weight: 100,
      },
    ],
    "Daging Segar": [
      {
        name: "Daging Sapi Giling",
        description: "Daging sapi segar untuk bakso/burger.",
        price: 90000,
        image: "https://res.cloudinary.com/demo/image/upload/sapigiling.jpg",
        weight: 100,
      },
      {
        name: "Daging Ayam Fillet",
        description: "Dada ayam tanpa tulang.",
        price: 45000,
        image: "dada-ayam_dthfw4.jpg",
        weight: 100,
      },
    ],
    "Ikan & Seafood": [
      {
        name: "Ikan Kembung",
        description: "Ikan laut kaya omega 3.",
        price: 35000,
        image: "seafood_p8y4pf.jpg",
        weight: 100,
      },
      {
        name: "Udang Vaname 500gr",
        description: "Udang segar beku.",
        price: 55000,
        image: "https://res.cloudinary.com/demo/image/upload/udang.jpg",
        weight: 100,
      },
    ],
    "Frozen Food": [
      {
        name: "Nugget Ayam Crispy",
        description: "Nugget ayam lapis renyah.",
        price: 35000,
        image: "nugget_plgi8w.jpg",
        weight: 100,
      },
      {
        name: "Kentang Goreng Beku",
        description: "French fries siap goreng.",
        price: 30000,
        image: "spaghetti_pbjvhc.jpg",
        weight: 100,
      },
    ],
    "Makanan Siap Masak": [
      {
        name: "Nasi Goreng Spesial",
        description: "Nasi goreng khas Indonesia.",
        price: 25000,
        image: "nasigoreng_mcsm1w.jpg",
        weight: 100,
      },
      {
        name: "Bakso Kuah Pedas",
        description: "Bakso sapi kuah sambal.",
        price: 22000,
        image: "https://res.cloudinary.com/demo/image/upload/bakso.jpg",
        weight: 100,
      },
    ],
    "Bumbu & Rempah": [
      {
        name: "Bawang Putih 100gr",
        description: "Bumbu dasar masakan.",
        price: 4000,
        image: "bawangputih_zwsasa.jpg",
        weight: 100,
      },
      {
        name: "Cabai Merah Keriting",
        description: "Cabai untuk sambal dan masak.",
        price: 10000,
        image: "https://res.cloudinary.com/demo/image/upload/cabai.jpg",
        weight: 100,
      },
    ],
    "Telur & Produk Ternak": [
      {
        name: "Telur Ayam Negeri 1kg",
        description: "Telur ayam segar.",
        price: 28000,
        image: "telur_xvboei.jpg",
        weight: 100,
      },
      {
        name: "Tahu Putih 5pcs",
        description: "Tahu segar untuk digoreng.",
        price: 8000,
        image: "https://res.cloudinary.com/demo/image/upload/tahu.jpg",
        weight: 100,
      },
    ],
    "Susu & Olahan": [
      {
        name: "Indomilk UHT Cokelat",
        description: "Susu UHT rasa cokelat.",
        price: 15000,
        image: "susu-full-cream_eojjnc.jpg",
        weight: 100,
      },
      {
        name: "Yogurt Stroberi Botol",
        description: "Minuman yogurt rasa stroberi.",
        price: 12000,
        image: "https://res.cloudinary.com/demo/image/upload/yogurt.jpg",
        weight: 100,
      },
    ],
    "Minuman Segar": [
      {
        name: "Teh Botol Sosro",
        description: "Minuman teh manis botol.",
        price: 4500,
        image: "condiments-sauces_vrbjkm.jpg",
        weight: 100,
      },
      {
        name: "Fruit Tea Blackcurrant",
        description: "Teh rasa blackcurrant.",
        price: 5000,
        image: "https://res.cloudinary.com/demo/image/upload/fruittea.jpg",
        weight: 100,
      },
    ],
    "Paket Masak Harian": [
      {
        name: "Paket Masak Capcay",
        description: "Isi wortel, kol, ayam, dll.",
        price: 35000,
        image: "capcay_tu6veo.jpg",
        weight: 100,
      },
      {
        name: "Paket Nasi Goreng Komplit",
        description: "Nasi, ayam, telur, sayur.",
        price: 40000,
        image: "https://res.cloudinary.com/demo/image/upload/nasigorengpaket.jpg",
        weight: 100,
      },
    ],
    "Promo & Diskon": [
      {
        name: "Paket Hemat Bakso + Es Teh",
        description: "Hemat spesial akhir pekan.",
        price: 20000,
        image: "https://res.cloudinary.com/demo/image/upload/promo.jpg",
        weight: 100,
      },
    ],
  };

  const createdProducts: { id: number; name: string }[] = [];

  for (const [categoryName, products] of Object.entries(productMap)) {
    const category = categories.find((c) => c.name === categoryName);
    if (!category) continue;

    for (const p of products) {
      const product = await prisma.products.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          weight: p.weight,
          image: p.image,
          slug: p.name.toLowerCase().replace(/\s+/g, "-"),
          categoryId: category.id,
          createdAt: now,
          updatedAt: now,
        },
      });

      createdProducts.push({ id: product.id, name: product.name });

      // === Tambahkan stok ke maksimal 5 cabang ===
      const shuffled = [...branches].sort(() => 0.5 - Math.random());
      const selectedBranches = shuffled.slice(0, 5); // maksimal 5 cabang

      for (const branch of selectedBranches) {
        await prisma.product_branchs.create({
          data: {
            productId: product.id,
            branchId: branch.id,
            stock: Math.floor(Math.random() * 10) + 1, // stok 1–10
            updatedAt: now,
          },
        });
      }
    }
  }

  console.log(`✅ seedProducts selesai: ${createdProducts.length} produk dimasukkan ke maksimal 5 cabang.`);
};
