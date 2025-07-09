import { IOrder } from "@/interfaces/order.interface";

interface OrderHistoryTableProps {
  orders: IOrder[];
}

export default function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const getStatusClass = (status: IOrder["status"]) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "On the way":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Recent Order History
        </h3>
        <a href="#" className="text-green-600 font-semibold hover:underline">
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-500 uppercase">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="">
                <td className="py-4 px-4 font-medium text-gray-800">
                  {order.id}
                </td>
                <td className="py-4 px-4 text-gray-600">{order.date}</td>
                <td className="py-4 px-4 text-gray-600">
                  ${order.total.toFixed(2)} ({order.productCount} Products)
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <a
                    href="#"
                    className="text-green-600 font-semibold hover:underline"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
