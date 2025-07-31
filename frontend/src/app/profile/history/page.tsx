"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/stores/order.store";
import AllOrderHistoryTable from "@/components/profile/all-order-history";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [noOrder, setNoOrder] = useState("");

  const fetchOrders = async (date?: string, noOrder?: string) => {
    setLoading(true);
    try {
      const data = await getOrders(-1, undefined, date, noOrder);
      setOrders(data || []);
    } catch (e) {
      setOrders([]);
    }
    setLoading(false);
  };

  // Fetch di mount & saat filter berubah
  useEffect(() => {
    fetchOrders(date, noOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="col-span-1 lg:col-span-2">
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            value={noOrder}
            onChange={(e) => setNoOrder(e.target.value)}
            placeholder="Cari No Order"
            className="border rounded px-3 py-2"
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => fetchOrders(date, noOrder)}
            disabled={loading}
          >
            Filter
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => {
              setDate("");
              setNoOrder("");
            }}
            disabled={loading}
          >
            Reset
          </button>
        </div>
        {loading ? "Loading..." : <AllOrderHistoryTable orders={orders} />}
      </div>
    </div>
  );
}
