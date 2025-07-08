import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { DetailOrder } from './DetailOrder';
import ConfirmModal from './ConfirmModal';
import UploadPaymentPage from './UploadPayment';
import Link from 'next/link';

export default function ActionOrder({ order, mutation }: any) {
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openPayment, setOpenPayment] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [id, setId] = useState<number>(0);
  const [forModal, setFor] = useState<string>('');

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedOrder(null);
  };

  const handleOpenPayment = (order: any) => {
    setSelectedOrder(order);
    setOpenPayment(true);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
    setSelectedOrder(null);
  };

  return (
    <div className="dropdown dropdown-end">
      {openDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-70"></div>
          <DetailOrder
            show={openDetail}
            order={selectedOrder}
            onClose={handleCloseDetail}
          />
        </div>
      )}

      {openPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-70"></div>
          <UploadPaymentPage
            order={selectedOrder}
            onClose={handleClosePayment}
            to="confirm-payment"
          />
        </div>
      )}
      <div tabIndex={0} role="button" className="">
        <FaBars />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
      >
        {order && (
          <li className="my-1">
            <a
              className="font-semibold bg-slate-300"
              onClick={() => handleOpenDetail(order)}
            >
              Detail
            </a>
          </li>
        )}
        {order && order.paymentStatus == 'UNPAID' && (
          <li className="my-1">
            <a
              className="font-semibold bg-red-400"
              onClick={() => {
                setConfirmationModal(true);
                setId(order.id);
                setFor('cancel order');
              }}
            >
              Cancel Order
            </a>
          </li>
        )}
        {order && order.paymentStatus == 'PAID' && (
          <>
            <li className="my-1">
              <a
                className="font-semibold bg-green-400"
                onClick={() => handleOpenPayment(order)}
              >
                Confirm Payment
              </a>
            </li>
            <li className="my-1">
              <a
                className="font-semibold bg-red-400"
                onClick={() => {
                  setConfirmationModal(true);
                  setId(order.id);
                  setFor('cancel order');
                }}
              >
                Cancel Order
              </a>
            </li>
          </>
        )}
        {order && order.paymentStatus == 'PROCESSING' && (
          <>
            <li className="my-1">
              <a
                className="font-semibold bg-green-400"
                onClick={() => {
                  setConfirmationModal(true);
                  setId(order.id);
                  setFor('send order');
                }}
              >
                Send Order
              </a>
            </li>
            <li className="my-1">
              <a
                className="font-semibold bg-red-400"
                onClick={() => {
                  setConfirmationModal(true);
                  setId(order.id);
                  setFor('cancel order');
                }}
              >
                Cancel Order
              </a>
            </li>
          </>
        )}
        {mutation?.status == 'PENDING' && (
          <>
            <li className="my-1">
              <Link href={`/admin/mutation/${mutation.id}`}>
                <span className="font-semibold">Update Stock</span>
              </Link>
            </li>
          </>
        )}
      </ul>
      {confirmationModal === true ? (
        <ConfirmModal
          id={id}
          setModal={setConfirmationModal}
          title={forModal}
        />
      ) : null}
    </div>
  );
}
