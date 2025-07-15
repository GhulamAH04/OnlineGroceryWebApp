import { User } from "@prisma/client";

// File ini secara otomatis akan menggabungkan tipenya ke dalam namespace Express global
// berkat struktur folder dan konfigurasi tsconfig.json.

declare global {
  namespace Express {
    interface Request {
      // Deklarasi ini memberitahu seluruh aplikasi bahwa 'req.user' ada
      // dan memiliki tipe 'User' yang kita impor dari Prisma.
      user?: User;
    }
  }
}

// Baris ini penting untuk memastikan TypeScript memperlakukan file ini sebagai modul.
export {};
