
/*
import Link from "next/link";

// Definisikan tipe data untuk setiap pesanan
type Order = {
  id: string;
  date: string;
  total: string;
  productCount: number;
  status: "Processing" | "On the way" | "Completed";
};

// Data tiruan (mock data) untuk ditampilkan
const mockOrders: Order[] = [
  {
    id: "#738",
    date: "8 Sep, 2020",
    total: "$125.00",
    productCount: 5,
    status: "Processing",
  },
  {
    id: "#703",
    date: "24 May, 2020",
    total: "$25.00",
    productCount: 1,
    status: "On the way",
  },
  {
    id: "#130",
    date: "22 Oct, 2020",
    total: "$250.00",
    productCount: 4,
    status: "Completed",
  },
  {
    id: "#581",
    date: "1 Feb, 2020",
    total: "$35.00",
    productCount: 1,
    status: "Completed",
  },
  {
    id: "#536",
    date: "21 Sep, 2020",
    total: "$570.00",
    productCount: 13,
    status: "Completed",
  },
];

// Komponen untuk badge status dengan warna kondisional
const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  const statusClasses = {
    Processing: "bg-yellow-100 text-yellow-800",
    "On the way": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

export default function RecentOrdersTable() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">Recent Order History</h3>
        <Link
          href="/dashboard/orders"
          className="text-green-600 font-semibold hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-3 px-4">ORDER ID</th>
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">TOTAL</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-800">
                  {order.id}
                </td>
                <td className="py-4 px-4 text-gray-600">{order.date}</td>
                <td className="py-4 px-4 text-gray-600">
                  {order.total} ({order.productCount} Products)
                </td>
                <td className="py-4 px-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-4 px-4 text-right">
                  <Link
                    href={`/dashboard/orders/${order.id.replace("#", "")}`}
                    className="text-green-600 font-semibold hover:underline"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
*/