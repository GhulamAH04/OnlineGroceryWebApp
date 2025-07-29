import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Resetting related tables...');
  await prisma.order_products.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.journal_mutations.deleteMany();
  await prisma.product_branchs.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.addresses.deleteMany();
  await prisma.products.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.branchs.deleteMany();
  await prisma.users.deleteMany({
    where: {
      email: {
        in: ['superadmin@email.com', 'storeadmin@email.com', 'pembeli@email.com'],
      },
    },
  });
  await prisma.districts.deleteMany();
  await prisma.cities.deleteMany();
  await prisma.provinces.deleteMany();

  // === PROVINSI
  const province = await prisma.provinces.create({
    data: { id: 100, name: 'Provinsi Groceria' },
  });

  // === KOTA
  const city = await prisma.cities.create({
    data: {
      id: 200,
      name: 'Kota Sayuran',
      provinceId: province.id,
    },
  });

  // === DISTRIK
  const district = await prisma.districts.create({
    data: {
      id: 300,
      name: 'Kecamatan Sehat',
      cityId: city.id,
    },
  });

  // === CABANG
  const branch = await prisma.branchs.create({
    data: {
      name: 'Groceria Pusat',
      address: 'Jl. Groceria No.1',
      postalCode: '12345',
      phone: '0210001234',
      latitude: 1.2345,
      longitude: 103.1234,
      provinceId: province.id,
      cityId: city.id,
      districtId: district.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // === SUPER ADMIN
  const superadmin = await prisma.users.create({
    data: {
      email: 'superadmin@email.com',
      password:
        '$2b$12$PEhzRU4UE.BPGC3Xx5oP/OpfBDBO.TrgQFmXcFW3b9trfMonKc6YG', // superadmin123
      role: 'SUPER_ADMIN',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // === STORE ADMIN
  const storeAdmin = await prisma.users.create({
    data: {
      email: 'storeadmin@email.com',
      password:
        '$2b$12$PEhzRU4UE.BPGC3Xx5oP/OpfBDBO.TrgQFmXcFW3b9trfMonKc6YG', // superadmin123
      role: 'STORE_ADMIN',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // === LINK STORE ADMIN KE CABANG
  await prisma.branchs.update({
    where: { id: branch.id },
    data: { userId: storeAdmin.id },
  });

  // === CATEGORIES
  const categoriesData = [
    { name: 'Sayuran', slug: 'sayuran' },
    { name: 'Buah-buahan', slug: 'buah-buahan' },
    { name: 'Minuman', slug: 'minuman' },
    { name: 'Daging', slug: 'daging' },
    { name: 'Sembako', slug: 'sembako' },
  ];

  for (const cat of categoriesData) {
    await prisma.categories.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  const kategori = await prisma.categories.findMany();

  // === PRODUCTS
  const produk = await Promise.all(
    kategori.map((cat, i) =>
      prisma.products.create({
        data: {
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

  // === STOK PER CABANG
  for (const p of produk) {
    await prisma.product_branchs.create({
      data: {
        branchId: branch.id,
        productId: p.id,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // === JURNAL MUTASI (stok masuk & keluar)
  for (const p of produk) {
    const pb = await prisma.product_branchs.findFirst({
      where: {
        productId: p.id,
        branchId: branch.id,
      },
    });

    if (pb) {
      await prisma.journal_mutations.createMany({
        data: [
          {
            productBranchId: pb.id,
            branchId: branch.id,
            quantity: 10,
            transactionType: 'IN',
            description: 'Stok awal',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            productBranchId: pb.id,
            branchId: branch.id,
            quantity: 3,
            transactionType: 'OUT',
            description: 'Uji coba',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      });
    }
  }

  // === DISKON
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

  // === USER
  const user = await prisma.users.create({
    data: {
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

  // === ORDER BULANAN
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

  console.log('✅ Dummy data berhasil di-seed ulang dengan aman.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error saat seed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
