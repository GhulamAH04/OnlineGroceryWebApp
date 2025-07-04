import { IUser } from "@/interfaces/auth.interface";
import { IAddress } from "@/interfaces/address.interface";
import { IOrder } from "@/interfaces/order.interface";
import Address from "./addresss";
import OrderHistoryTable from "./order-history";
import ProfileHeader from "./profile-header";
import Sidebar from "./sidebar";

const mockUser: IUser = {
  id: 1,
  email: "dianne@gmail.com",
  username: "Dianne Russell",
  role: "Customer",
  image: "https://placehold.co/100x100/e2e8f0/4a5568?text=DR", // Placeholder image
};

const mockAddress: IAddress = {
  street: "4140 Parker Rd. Allentown, New Mexico",
  city: "Allentown",
  state: "New Mexico",
  zip: "31134",
  email: "dianne.russell@gmail.com",
  phone: "(671) 555-0110",
};

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

export default function Profile() {
  return (
    <div className="min-h-screen font-sans">
      <main className="container mx-auto py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-auto">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile and Billing Cards */}
              <ProfileHeader user={mockUser} />
              <Address address={mockAddress} />

              {/* Order History Table */}
              <div className="col-span-1 lg:col-span-2">
                <OrderHistoryTable orders={mockOrders} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
