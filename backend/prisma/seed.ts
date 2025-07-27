import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // === PROVINSI ===
  const province = await prisma.provinces.upsert({
    where: { id: 100 },
    update: {},
    create: { id: 100, name: 'Provinsi Groceria' },
  });

  // === KOTA ===
  const city = await prisma.cities.upsert({
    where: { id: 200 },
    update: {},
    create: {
      id: 200,
      name: 'Kota Sayuran',
      provinceId: province.id,
    },
  });

  // === DISTRIK ===
  const district = await prisma.districts.upsert({
    where: { id: 300 },
    update: {},
    create: {
      id: 300,
      name: 'Kecamatan Sehat',
      cityId: city.id,
    },
  });

  // === CABANG ===
  const branch = await prisma.branchs.create({
    data: {
      name: 'Groceria Pusat',
      provinceId: province.id,
      cityId: city.id,
      districtId: district.id,
      postalCode: '12345',
      phone: '0210001234',
      address: 'Jl. Groceria No.1',
      latitude: 1.234567,
      longitude: 103.123456,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // === SUPER ADMIN ===
  const superadmin = await prisma.users.upsert({
    where: { email: 'superadmin@email.com' },
    update: {},
    create: {
      email: 'superadmin@email.com',
      password:
        '$2b$12$PEhzRU4UE.BPGC3Xx5oP/OpfBDBO.TrgQFmXcFW3b9trfMonKc6YG', // superadmin123
      role: 'SUPER_ADMIN',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // === KATEGORI ===
  const categoriesData = [
    { name: 'Sayuran', slug: 'sayuran' },
    { name: 'Buah-buahan', slug: 'buah-buahan' },
    { name: 'Minuman', slug: 'minuman' },
    { name: 'Daging', slug: 'daging' },
    { name: 'Sembako', slug: 'sembako' },
  ];

  for (const cat of categoriesData) {
    await prisma.categories.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  const kategori = await prisma.categories.findMany();

  // === PRODUK ===
  const produk = await Promise.all(
    kategori.map((cat, i) =>
      prisma.products.upsert({
        where: { slug: `produk-${cat.slug}` },
        update: {},
        create: {
          name: `Produk ${cat.name}`,
          slug: `produk-${cat.slug}`,
          price: 10000 + i * 2500,
          categoryId: cat.id,
          description: `Deskripsi untuk ${cat.name}`,
          image: '/product.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    )
  );

  // === STOK PRODUK ===
  for (const p of produk) {
    await prisma.product_branchs.create({
      data: {
        branchId: branch.id,
        productId: p.id,
        stock: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // === DISKON ===
  await prisma.discount.createMany({
    data: produk.slice(0, 3).map((p, i) => ({
      type: 'PERCENTAGE',
      value: 10 + i * 5,
      isPercentage: true,
      productId: p.id,
      branchId: branch.id,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  });

  // === USER & ADDRESS ===
  const user = await prisma.users.upsert({
    where: { email: 'pembeli@email.com' },
    update: {},
    create: {
      email: 'pembeli@email.com',
      password: null,
      role: 'USER',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const address = await prisma.addresses.create({
    data: {
      name: 'Alamat Utama',
      address: 'Jl. Utama No.123',
      postalCode: '12345',
      phone: '08123456789',
      userId: user.id,
      provinceId: province.id,
      cityId: city.id,
      districtId: district.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // === ORDER PER BULAN ===
  const tahun = new Date().getFullYear();
  for (let bulan = 0; bulan < 12; bulan++) {
    const tanggal = new Date(tahun, bulan, 15);
    const order = await prisma.orders.create({
      data: {
        name: `Order Bulan ${bulan + 1}`,
        paymentStatus: 'PAID',
        shippingCost: 10000,
        total: 50000,
        paymentMethod: 'COD',
        expirePayment: new Date(tanggal.getTime() + 3600000),
        branchId: branch.id,
        userId: user.id,
        addressId: address.id,
        createdAt: tanggal,
        updatedAt: tanggal,
      },
    });

    await prisma.order_products.create({
      data: {
        orderId: order.id,
        productId: produk[bulan % produk.length].id,
        quantity: 2,
        price: produk[bulan % produk.length].price,
        total: produk[bulan % produk.length].price * 2,
        createdAt: tanggal,
        updatedAt: tanggal,
      },
    });
  }

  console.log('✅ Dummy data berhasil di-seed ulang sesuai schema terbaru');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });