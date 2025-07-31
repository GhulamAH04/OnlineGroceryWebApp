function getStatusClass(status: string) {
  switch (status) {
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    case "On the way":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Canceled":
      return "bg-red-100 text-red-800";
    case "Unpaid":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatDate(date: string) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function mapOrderStatus(order: any): string {
  if (order.paymentStatus === "CANCELED") return "Canceled";
  if (order.paymentStatus === "UNPAID") return "Unpaid";
  if (order.paymentStatus === "PAID") {
    if (!order.shippedAt) return "Processing";
    if (order.shippedAt && !order.completedAt) return "On the way";
    if (order.completedAt) return "Completed";
  }
  return "Unknown";
}

export default function AllOrderHistoryTable({ orders }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">All Order History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs text-gray-500 uppercase">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">
                  Tidak ada riwayat pesanan.
                </td>
              </tr>
            ) : (
              <>
                {orders.map((order: any) => {
                  const status = mapOrderStatus(order);
                  const totalProducts =
                    order.order_products?.reduce(
                      (a: any, b: any) => a + b.quantity,
                      0
                    ) || 0;
                  return (
                    <tr key={order.id}>
                      <td className="py-4 px-4 font-medium text-gray-800">
                        {order.name || order.id}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        Rp{order.total.toLocaleString("id-ID")}{" "}
                        <span className="text-xs text-gray-400">
                          ({totalProducts} produk)
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={`/order/${order.id}`}
                          className="text-green-600 font-semibold hover:underline"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
