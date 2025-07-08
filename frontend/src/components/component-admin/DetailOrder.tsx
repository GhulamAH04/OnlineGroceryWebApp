'use client';
import { getOrderDetail } from '@/api/order';
import { formattedDate, formattedMoney } from '@/helper/helper';
import { OrderDetail } from '@/interface/orderDetail.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const DetailOrder = (props: any) => {
  const [showModal, setShowModal] = useState(props.show);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<OrderDetail[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getOrderDetail(props.order.id);
      setData(response.data);
      setLoading(false);
    };

    fetchData();
  }, [props.order.id]);

  const openPaymentProof = (image: string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/payments/${image}`,
      '_blank',
    );
  };

  return (
    showModal && (
      <div className="relative bg-white p-4 rounded-lg shadow-lg z-10 max-w-full w-full sm:max-w-lg">
        <h1 className="text-xl font-bold mb-4">Detail Order</h1>

        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-left px-2">No</th>
                <th className="text-left px-2">Product</th>
                <th className="text-right px-2">Price</th>
                <th className="text-center px-2">Qty</th>
                <th className="text-right px-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="h-32 text-center p-4 font-bold">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-4 font-bold">
                    No detail order
                  </td>
                </tr>
              ) : (
                data?.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="text-center">{index + 1}</td>
                    <td className="flex items-center space-x-2 w-60">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/products/${item.product.image}`}
                        width={50}
                        height={50}
                        alt="image product"
                        className="rounded-md object-cover"
                      />
                      <span>{item.product.name}</span>
                    </td>
                    <td className="text-right">
                      {formattedMoney(item.product.price)}
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      {formattedMoney(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <hr className="my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">
              Order No :{' '}
              <span className="font-semibold">{props.order.name}</span>
            </p>
            <p className="text-sm">
              Status :{' '}
              <span className="font-semibold">{props.order.paymentStatus}</span>
            </p>
            <p className="text-sm">
              Transaction Date :{' '}
              <span className="font-semibold">
                {formattedDate(props.order.createdAt)}
              </span>
            </p>
            {props.order.paymentStatus === 'SHIPPED' && (
              <p className="text-sm">
                Shipped Date :{' '}
                <span className="font-semibold">
                  {formattedDate(props.order.shippedAt)}
                </span>
              </p>
            )}
            {props.order.paymentProof != null && (
              <a
                className="mt-4 text-blue-700 underline rounded-md cursor-pointer hover:font-bold"
                onClick={() => openPaymentProof(props.order.paymentProof)}
              >
                View Payment Proof
              </a>
            )}
          </div>

          <div>
            <p className="text-sm">
              Payment Method :{' '}
              <span className="font-semibold">{props.order.paymentMethod}</span>
            </p>
            <p className="text-sm">
              Shipping Cost :{' '}
              <span className="font-semibold">
                {formattedMoney(props.order.shippingCost)}
              </span>
            </p>
            <hr className="mt-2" />
            <p className="text-md">
              Total Price :{' '}
              <span className="text-lg font-semibold">
                {formattedMoney(props.order.total)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-200 border border-secondary rounded-md cursor-pointer hover:bg-gray-300"
            onClick={() => props.onClose(false)}
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};
