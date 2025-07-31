"use client";
import ProfileHeader from "@/components/profile/profile-header";
import OrderHistoryTable from "@/components/profile/order-history";
import MainAddress from "@/components/profile/main-address";
import { useEffect, useState } from "react";
import { getOrders } from "@/stores/order.store";

export default function ProfilePage() {
  const [orders, setOrders] = useState<[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // fetch 5 data
        const data = await getOrders(5, undefined);
        setOrders(data);
      } catch (e) {
        setOrders([]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Profile and Billing Cards */}
      <ProfileHeader />
      <MainAddress />

      {/* Order History Table */}
      <div className="col-span-1 lg:col-span-2">
        {loading ? "loading..." : <OrderHistoryTable orders={orders} />}
      </div>
    </div>
  );
}
