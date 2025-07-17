"use client";

import { useEffect, useState } from "react";
import ProductTable from "@/components/features2/productManagement/ProductTable";
import AddProductModal from "@/components/features2/productManagement/AddProductModal";
import EditProductModal from "@/components/features2/productManagement/EditProductModal";
import DeleteProductModal from "@/components/features2/productManagement/DeleteProductModal";
import { Product } from "@/interfaces";

export default function Dashboard() {
  // ===== State Management =====
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ===== Notifikasi Feedback =====
  // codingan untuk feedback/toast notification
  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  // ===== Fetching Product Data (dengan search & pagination) =====
  // codingan untuk fetching product
  const fetchProduk = () => {
    // Untuk backend yang butuh token, bisa isi dengan token dummy/hasil login
    const token = localStorage.getItem("token") || "dummy";
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?search=${encodeURIComponent(
        search
      )}&page=${page}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data?.data || []);
        setTotalPages(data.data?.totalPages || 1); // Backend wajib return totalPages
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // ===== Re-fetch Produk Setiap Kali Search/Page Berubah =====
  useEffect(() => {
    fetchProduk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  // ======= UI RETURN START =======
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
          {/* Dashboard Header */}
          <h1 className="text-3xl font-bold mb-4 text-center">
            Dashboard Admin
          </h1>
          <p className="mb-4 text-center">Selamat datang di dashboard admin!</p>

          {/* Notifikasi Feedback */}
          {feedback && (
            <div className="mb-4 text-center bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded">
              {feedback}
            </div>
          )}

          {/* Tombol Tambah Produk */}
          <div className="mb-4 flex justify-end">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(true)}
            >
              + Tambah Produk
            </button>
          </div>

          {/* Search Bar & Pagination */}
          <div className="flex justify-between mb-4">
            {/* Input Search */}
            <input
              type="text"
              placeholder="Cari produk..."
              className="border rounded p-2 w-1/3"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset ke halaman 1 saat search berubah
              }}
            />
            {/* Pagination Button */}
            <div>
              <button
                className="px-3 py-1 bg-gray-300 rounded mr-2"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="font-semibold">
                {page} / {totalPages}
              </span>
              <button
                className="px-3 py-1 bg-gray-300 rounded ml-2"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          {/* Modal Tambah Produk */}
          {showModal && (
            <AddProductModal
              onAdd={fetchProduk}
              onClose={() => setShowModal(false)}
              onFeedback={showFeedback}
            />
          )}

          {/* Modal Edit Produk */}
          {editProduct && (
            <EditProductModal
              product={editProduct}
              onUpdate={fetchProduk}
              onClose={() => setEditProduct(null)}
              onFeedback={showFeedback}
            />
          )}

          {/* Modal Delete Produk */}
          {deleteProduct && (
            <DeleteProductModal
              product={deleteProduct}
              onDelete={fetchProduk}
              onClose={() => setDeleteProduct(null)}
              onFeedback={showFeedback}
            />
          )}

          {/* Product Table */}
          {loading ? (
            <p>Loading data produk...</p>
          ) : (
            <ProductTable
              products={products}
              onEdit={setEditProduct}
              onDelete={setDeleteProduct}
            />
          )}
        </div>
      </div>
  );
}
