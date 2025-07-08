import { useState } from 'react';
import { cancelOrder, confirmOrder, sendOrder } from '@/api/order';
import { deleteAddress } from '@/api/address';
import { deleteUserProcess } from '@/api/user';
import { deleteProduct } from '@/api/products';
import { deleteCategory } from '@/api/category';
import { deleteBranch } from '@/api/branch';

export default function ConfirmModal(props: {
  id: number;
  setModal: any;
  title: string;
}) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await cancelOrder(props.id);

      const { status } = response;

      if (status == 'success') {
        showToast('Success cancel order');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmation = async () => {
    try {
      const response = await confirmOrder(props.id);

      const { status } = response;

      if (status == 'success') {
        showToast('Success confirm order');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendOrder = async () => {
    try {
      const response = await sendOrder(props.id);

      const { status } = response;

      if (status == 'success') {
        showToast('Success send order');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      const response = await deleteAddress(props.id);

      const { status } = response;

      if (status == 'success') {
        showToast('Success delete event');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      const response = await deleteUserProcess(props.id);

      const { status } = response;

      if (status == 'success') {
        showToast('Success delete user');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProducts = async () => {
    try {
      const response = await deleteProduct(props.id.toString());

      const { status } = response;

      if (status == 'success') {
        showToast('Success delete product');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await deleteCategory(props.id);

      const { status } = response;

      if (status == 'success') {
        showToast('Success delete category');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBranch = async () => {
    try {
      const response = await deleteBranch(props.id);

      const { status } = response;

      if (status == 'success') {
        showToast('Success delete branch');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {toastVisible && (
        <div className="toast toast-top toast-end top-[3rem]">
          <div className="alert alert-info">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className={`bg-white p-8 rounded-lg shadow-lg z-10 border-t-8`}>
        <h3 className="text-xl font-bold">Confirm {props.title}</h3>
        <p className="my-2">Are you sure to {props.title} this data?</p>
        <div className="grid grid-cols-2 gap-2 items-center text-center">
          <a
            className="p-2 my-4 border bg-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={() => {
              if (props.title === 'cancel order') {
                handleDelete();
              } else if (props.title === 'received order') {
                handleConfirmation();
              } else if (props.title === 'send order') {
                handleSendOrder();
              } else if (props.title === 'address') {
                handleDeleteAddress();
              } else if (props.title === 'Delete user') {
                handleDeleteUsers();
              } else if (props.title === 'Delete product') {
                handleDeleteProducts();
              } else if (props.title === 'Delete category') {
                handleDeleteCategory();
              } else if (props.title === 'Delete branch') {
                handleDeleteBranch();
              }
            }}
          >
            Yes
          </a>
          <a
            className="p-2 border border-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={() => props.setModal(false)}
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
