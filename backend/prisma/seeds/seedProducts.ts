// === FILE: prisma/seeds/seedProducts.ts ===
import { PrismaClient } from "@prisma/client";

export const seedProducts = async (prisma: PrismaClient) => {
  console.log("⏳ Seeding products...");

  const categories = await prisma.categories.findMany();
  const branches = await prisma.branchs.findMany();
  const now = new Date();

  // Clear existing products and stocks
  await prisma.order_products.deleteMany();
  await prisma.product_branchs.deleteMany();
  await prisma.products.deleteMany();

  // Produk berdasarkan kategori
  const productMap: Record<string, { name: string; description: string; price: number; image: string }[]> = {
    "Sayur Segar": [
      { name: "Bayam Segar", description: "Bayam hijau segar siap masak.", price: 5000, image: "https://res.cloudinary.com/demo/image/upload/bayam.jpg" },
      { name: "Wortel Lokal", description: "Wortel manis cocok untuk sup.", price: 6000, image: "https://res.cloudinary.com/demo/image/upload/wortel.jpg" },
      { name: "Kol Putih", description: "Kol segar untuk tumisan.", price: 7000, image: "https://res.cloudinary.com/demo/image/upload/kolputih.jpg" },
    ],
    "Buah Segar": [
      { name: "Pisang Cavendish", description: "Pisang manis kaya potasium.", price: 15000, image: "https://res.cloudinary.com/demo/image/upload/pisang.jpg" },
      { name: "Apel Fuji", description: "Apel merah renyah dari Jepang.", price: 25000, image: "https://res.cloudinary.com/demo/image/upload/apel.jpg" },
    ],
    "Daging Segar": [
      { name: "Daging Sapi Giling", description: "Daging sapi segar untuk bakso/burger.", price: 90000, image: "https://res.cloudinary.com/demo/image/upload/sapigiling.jpg" },
      { name: "Daging Ayam Fillet", description: "Dada ayam tanpa tulang.", price: 45000, image: "https://res.cloudinary.com/demo/image/upload/ayamfillet.jpg" },
    ],
    "Ikan & Seafood": [
      { name: "Ikan Kembung", description: "Ikan laut kaya omega 3.", price: 35000, image: "https://res.cloudinary.com/demo/image/upload/kembung.jpg" },
      { name: "Udang Vaname 500gr", description: "Udang segar beku.", price: 55000, image: "https://res.cloudinary.com/demo/image/upload/udang.jpg" },
    ],
    "Frozen Food": [
      { name: "Nugget Ayam Crispy", description: "Nugget ayam lapis renyah.", price: 35000, image: "https://res.cloudinary.com/demo/image/upload/nugget.jpg" },
      { name: "Kentang Goreng Beku", description: "French fries siap goreng.", price: 30000, image: "https://res.cloudinary.com/demo/image/upload/kentang.jpg" },
    ],
    "Makanan Siap Masak": [
      { name: "Nasi Goreng Spesial", description: "Nasi goreng khas Indonesia.", price: 25000, image: "https://res.cloudinary.com/demo/image/upload/nasigoreng.jpg" },
      { name: "Bakso Kuah Pedas", description: "Bakso sapi kuah sambal.", price: 22000, image: "https://res.cloudinary.com/demo/image/upload/bakso.jpg" },
    ],
    "Bumbu & Rempah": [
      { name: "Bawang Putih 100gr", description: "Bumbu dasar masakan.", price: 4000, image: "https://res.cloudinary.com/demo/image/upload/bawangputih.jpg" },
      { name: "Cabai Merah Keriting", description: "Cabai untuk sambal dan masak.", price: 10000, image: "https://res.cloudinary.com/demo/image/upload/cabai.jpg" },
    ],
    "Telur & Produk Ternak": [
      { name: "Telur Ayam Negeri 1kg", description: "Telur ayam segar.", price: 28000, image: "https://res.cloudinary.com/demo/image/upload/telur.jpg" },
      { name: "Tahu Putih 5pcs", description: "Tahu segar untuk digoreng.", price: 8000, image: "https://res.cloudinary.com/demo/image/upload/tahu.jpg" },
    ],
    "Susu & Olahan": [
      { name: "Indomilk UHT Cokelat", description: "Susu UHT rasa cokelat.", price: 15000, image: "https://res.cloudinary.com/demo/image/upload/indomilk.jpg" },
      { name: "Yogurt Stroberi Botol", description: "Minuman yogurt rasa stroberi.", price: 12000, image: "https://res.cloudinary.com/demo/image/upload/yogurt.jpg" },
    ],
    "Minuman Segar": [
      { name: "Teh Botol Sosro", description: "Minuman teh manis botol.", price: 4500, image: "https://res.cloudinary.com/demo/image/upload/tehbotol.jpg" },
      { name: "Fruit Tea Blackcurrant", description: "Teh rasa blackcurrant.", price: 5000, image: "https://res.cloudinary.com/demo/image/upload/fruittea.jpg" },
    ],
    "Paket Masak Harian": [
      { name: "Paket Masak Capcay", description: "Isi wortel, kol, ayam, dll.", price: 35000, image: "https://res.cloudinary.com/demo/image/upload/capcay.jpg" },
      { name: "Paket Nasi Goreng Komplit", description: "Nasi, ayam, telur, sayur.", price: 40000, image: "https://res.cloudinary.com/demo/image/upload/nasigorengpaket.jpg" },
    ],
    "Promo & Diskon": [
      { name: "Paket Hemat Bakso + Es Teh", description: "Hemat spesial akhir pekan.", price: 20000, image: "https://res.cloudinary.com/demo/image/upload/promo.jpg" },
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
          image: p.image,
          slug: p.name.toLowerCase().replace(/\s+/g, "-"),
          categoryId: category.id,
          createdAt: now,
          updatedAt: now,
        },
      });

      createdProducts.push({ id: product.id, name: product.name });

      for (const branch of branches) {
        await prisma.product_branchs.create({
          data: {
            productId: product.id,
            branchId: branch.id,
            stock: Math.floor(Math.random() * 50) + 5,
            createdAt: now,
            updatedAt: now,
          },
        });
      }
    }
  }

  console.log(`✅ seedProducts selesai: ${createdProducts.length} produk dimasukkan dengan stok per cabang.`);
};