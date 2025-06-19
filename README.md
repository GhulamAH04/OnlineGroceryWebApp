# OnlineGroceryWebApp
Online Grocery Web App adalah sebuah aplikasi e-commerce yang memiliki fungsi untuk berbelanja secara online, dimana si pembeli dapat memilih lokasi toko tersebut. Adapun toko yang menjual barang memiliki beberapa cabang yang terletak di lokasi berbeda. Setiap toko menjual produk yang sama (toko di lokasi lain merupakan cabang). 

# Struktur Backend
backend/
├── src/
│   ├── modules/
│   │   ├── auth/#Login, register, verification,resetPassword (F1)
│   │   ├── user/ # Profile, role, address, referral (F1, F3)
│   │   ├── store/  # Store management (F2)
│   │   ├── admin/  # Admin assignment, manage user data (F2)
│   │   ├── product/             # Product CRUD (F2)
│   │   ├── category/            # Product category (F2)
│   │   ├── inventory/           # Stock update + journal (F2)
│   │   ├── discount/            # Promo + voucher logic (F2)
│   │   ├── order/      # Create order, confirm, cancel (F3)
│   │   ├── cart/                # Add/update/delete cart (F3)
│   │   └── report/              # Sales & stock reports (F2)
│   ├── middlewares/            # Auth, upload, validation
│   ├── utils/                  # Response helper, location calc
│   ├── config/                 # Env, DB config
│   ├── app.ts
│   └── server.ts
│─── prisma/                 # Schema, migration, seed

# Struktur Frontend
frontend/
├── public/                             # Aset statis (gambar, favicon, dsb.)
├── src/
│   ├── app/                            # Routing utama (App Router)
│   │   ├── layout.tsx                  # Root layout (navbar/footer global)
│   │   ├── page.tsx                    # Landing page (F1)
│   │   ├── login/page.tsx              # Login (F1)
│   │   ├── register/page.tsx           # Register (F1)
│   │   ├── profile/page.tsx            # User Profile (F1)
│   │   ├── dashboard/                  # Admin Dashboard (F2)
│   │   │   ├── layout.tsx              # Layout khusus admin
│   │   │   ├── admin/page.tsx          # Admin Account Management
│   │   │   ├── store/page.tsx          # Store Management
│   │   │   ├── product/page.tsx        # Product Management
│   │   │   ├── category/page.tsx       # Product Category
│   │   │   ├── inventory/page.tsx      # Inventory & Stock
│   │   │   ├── discount/page.tsx       # Discount & Promo
│   │   │   ├── report/page.tsx         # Sales & Stock Report
│   │   │   └── order/page.tsx          # Order Management (Admin)
│   │   ├── cart/page.tsx               # Shopping Cart (F3)
│   │   ├── checkout/page.tsx           # Checkout Process (F3)
│   │   ├── orders/page.tsx             # User Order History (F3)
│   │   ├── reset-password/             # Reset Password (F1)
│   │   │   ├── page.tsx                # Email input
│   │   │   └── [token]/page.tsx        # Confirm reset password
│   │   └── verify-email/[token]/page.tsx # Email Verification Page
│
│   ├── components/                     # Komponen UI
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── form/
│   │   ├── table/
│   │   ├── card/
│   │   └── modal/
│
│   ├── services/                       # API (axios)
│   │   ├── auth.api.ts
│   │   ├── user.api.ts
│   │   ├── store.api.ts
│   │   ├── product.api.ts
│   │   ├── cart.api.ts
│   │   └── order.api.ts
│
│   ├── store/                          # Zustand atau Redux (state management)
│   │   ├── auth.store.ts
│   │   ├── cart.store.ts
│   │   └── product.store.ts
│
│   ├── types/                          # Tipe TypeScript global
│   │   ├── user.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── store.ts
│
│   ├── lib/                            # Helper & utilitas umum
│   │   ├── auth.ts
│   │   ├── geolocation.ts
│   │   └── formatter.ts
│
│   ├── hooks/                          # Custom React Hooks
│   │   ├── useAuth.ts
│   │   └── useStoreLocation.ts
│
│   ├── utils/                          # Validator, konversi, dll.
│   │   ├── validateImage.ts
│   │   ├── formatPrice.ts
│   │   └── constants.ts
│
│   └── styles/                         # Tailwind config, custom styles
│       ├── globals.css
│       └── tailwind.config.ts
├── .env.local
├── package.json
└── tsconfig.json

