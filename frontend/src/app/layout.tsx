import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/homepage/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Online Grocery App",
  description: "Fresh groceries delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* Navbar diletakkan di sini */}
        <main>{children}</main> {/* Konten halaman akan dirender di sini */}
      </body>
    </html>
  );
}
