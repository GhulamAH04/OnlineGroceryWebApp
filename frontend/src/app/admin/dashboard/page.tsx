"use client";

import { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import AddProductModal from "@/components/AddProductModal";
import EditProductModal from "@/components/EditProductModal";
import DeleteProductModal from "@/components/DeleteProductModal";
import { Product } from "@/interfaces";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Show feedback & auto-dismiss after 2.5s
  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Fetch produk dari backend TANPA cek login/token
  const fetchProduk = () => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/admin/login");
    //   return;
    // }
    // Untuk backend yang butuh token, kamu bisa isi dengan token dummy/hasil login sebelumnya:
    const token = localStorage.getItem("token") || "dummy";

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data?.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProduk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">Dashboard Admin</h1>
        <p className="mb-4 text-center">Selamat datang di dashboard admin!</p>

        {/* Notifikasi Feedback */}
        {feedback && (
          <div className="mb-4 text-center bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded">
            {feedback}
          </div>
        )}

        <div className="mb-4 flex justify-end">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            + Tambah Produk
          </button>
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

        {/* Tabel Produk */}
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
