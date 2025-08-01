function formatDate(date: string) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusClass(paymentStatus: string) {
  switch (paymentStatus) {
    case "UNPAID":
      return "bg-gray-100 text-gray-800";
    case "PAID":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-800";
    case "SHIPPED":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-blue-100 text-blue-800";
    case "RECEIVED":
      return "bg-green-100 text-green-800";
    case "CANCELED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function mapOrderStatus(order: any): string {
  if (order.paymentStatus === "CANCELED") return "Dibatalkan";
  if (order.paymentStatus === "UNPAID") return "Menunggu Pembayaran";
  if (order.paymentStatus === "PROCESSING") return "Sedang Diproses";
  if (order.paymentStatus === "SHIPPED") return "Dikirim";
  if (order.paymentStatus === "PAID") return "Sedang Diproses";
  if (order.paymentStatus === "DELIVERED") return "Dikirim";
  if (order.paymentStatus === "RECEIVED") return "Diterima";
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
                            order.paymentStatus
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
