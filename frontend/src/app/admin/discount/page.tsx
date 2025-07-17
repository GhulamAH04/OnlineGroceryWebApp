"use client";
import { useEffect, useState } from "react";
import DiscountTable from "@/components/features2/discount/DiscountTable";
import AddDiscountModal from "@/components/features2/discount/AddDiscountModal";
import EditDiscountModal from "@/components/features2/discount/EditDiscountModal";
import DeleteDiscountModal from "@/components/features2/discount/DeleteDiscountModal";
import { Discount } from "@/interfaces";

export default function DiscountPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDiscount, setEditDiscount] = useState<Discount | null>(null);
  const [deleteDiscount, setDeleteDiscount] = useState<Discount | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  // Fetch discounts from backend
  const fetchDiscounts = () => {
    const token = localStorage.getItem("token") || "dummy";
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/discounts?search=${encodeURIComponent(
        search
      )}&page=${page}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        setDiscounts(data.data?.data || []);
        setTotalPages(data.data?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Discount Management
          </h1>

          {/* Feedback */}
          {feedback && (
            <div className="mb-4 text-center bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded">
              {feedback}
            </div>
          )}

          {/* Tambah Diskon */}
          <div className="mb-4 flex justify-end">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setShowAddModal(true)}
            >
              + Tambah Diskon
            </button>
          </div>

          {/* Search & Pagination */}
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Cari diskon..."
              className="border rounded p-2 w-1/3"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
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

          {/* Modals */}
          {showAddModal && (
            <AddDiscountModal
              onAdd={fetchDiscounts}
              onClose={() => setShowAddModal(false)}
              onFeedback={showFeedback}
            />
          )}
          {editDiscount && (
            <EditDiscountModal
              discount={editDiscount}
              onUpdate={fetchDiscounts}
              onClose={() => setEditDiscount(null)}
              onFeedback={showFeedback}
            />
          )}
          {deleteDiscount && (
            <DeleteDiscountModal
              discount={deleteDiscount}
              onDelete={fetchDiscounts}
              onClose={() => setDeleteDiscount(null)}
              onFeedback={showFeedback}
            />
          )}

          {/* Table */}
          {loading ? (
            <p>Loading data diskon...</p>
          ) : (
            <DiscountTable
              discounts={discounts}
              onEdit={setEditDiscount}
              onDelete={setDeleteDiscount}
            />
          )}
        </div>
      </div>
  );
}
