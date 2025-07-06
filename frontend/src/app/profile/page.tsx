import { IOrder } from "@/interfaces/order.interface";
import ProfileHeader from "@/components/profile/profile-header";
import OrderHistoryTable from "@/components/profile/order-history";
import MainAddress from "@/components/profile/main-address";

const mockOrders: IOrder[] = [
  {
    id: "#738",
    date: "8 Sep, 2020",
    total: 135.0,
    productCount: 5,
    status: "Processing",
  },
  {
    id: "#703",
    date: "24 May, 2020",
    total: 25.0,
    productCount: 1,
    status: "On the way",
  },
  {
    id: "#130",
    date: "22 Oct, 2020",
    total: 250.0,
    productCount: 4,
    status: "Completed",
  },
  {
    id: "#561",
    date: "1 Feb, 2020",
    total: 35.0,
    productCount: 1,
    status: "Completed",
  },
  {
    id: "#536",
    date: "21 Sep, 2020",
    total: 578.0,
    productCount: 13,
    status: "Completed",
  },
  {
    id: "#482",
    date: "22 Oct, 2020",
    total: 345.0,
    productCount: 7,
    status: "Completed",
  },
];

export default function ProfilePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Profile and Billing Cards */}
      <ProfileHeader/>
      <MainAddress />

      {/* Order History Table */}
      <div className="col-span-1 lg:col-span-2">
        <OrderHistoryTable orders={mockOrders} />
      </div>
    </div>
  );
}
