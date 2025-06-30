"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DiscountTable from "@/components/DiscountTable";
import AddDiscountModal from "@/components/AddDiscountModal";
import EditDiscountModal from "@/components/EditDiscountModal";
import DeleteDiscountModal from "@/components/DeleteDiscountModal";
import { Discount } from "@/interfaces";

export default function DiscountPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDiscount, setEditDiscount] = useState<Discount | null>(null);
  const [deleteDiscount, setDeleteDiscount] = useState<Discount | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const fetchDiscounts = () => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   router.push("/admin/login");
    //   return;
    // }
    const token = localStorage.getItem("token") || "dummy";
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/discounts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDiscounts(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDiscounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Discount Management
        </h1>
        <p className="mb-4 text-center">Kelola diskon produk per toko</p>

        {feedback && (
          <div className="mb-4 text-center bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded">
            {feedback}
          </div>
        )}

        <div className="mb-4 flex justify-end">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => setShowAddModal(true)}
          >
            + Tambah Diskon
          </button>
        </div>

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
