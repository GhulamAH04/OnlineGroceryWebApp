import { confirmPayment, uploadPayment } from '@/api/order';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import NotificationToast from './NotificationToast';

export default function UploadPaymentPage(props: any) {
  const [preview, setPreview] = useState<string | null>('');
  const [file, setFile] = useState<File | null>(null);
  const [notif, setNotif] = useState<{ message: string; status: string }>({
    message: '',
    status: '',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handlePayment = async () => {
    if (!file) {
      showToast({ message: 'Please upload payment proof!', status: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('paymentProof', file);
    formData.append('status', 'PAID');

    try {
      const response = await uploadPayment(props.order.id, formData);
      if (response.status === 'success') {
        showToast(response);
        setTimeout(() => {
          props.onClose(false);
          window.location.reload();
        }, 3000);
      } else {
        showToast({
          message: 'Failed to upload payment proof!',
          status: 'error',
        });
      }
    } catch (error) {
      showToast({ message: 'Error uploading payment proof!', status: 'error' });
    }
  };

  const handleConfirmPayment = async (orderId: number, confirm: string) => {
    try {
      let response;
      response = await confirmPayment(orderId, {
        status: confirm === 'accepted' ? 'PROCESSING' : 'UNPAID',
      });

      const { status } = response;

      if (status == 'success') {
        showToast(response);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (props.to == 'confirm-payment') {
      console.log(props.order, 'order');
      setPreview(
        `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/payments/` +
          props.order.paymentProof,
      );
    }
  }, [props.order, props.to]);

  const showToast = (data: { message: string; status: string }) => {
    setNotif(data);
    setTimeout(() => {
      setNotif({ message: '', status: '' });
    }, 3000);
  };

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-lg z-10 max-w-md mx-auto">
      <NotificationToast toastMessage={notif} />
      <h1 className="text-xl font-bold mb-4">
        {props.to !== 'confirm-payment' ? 'Upload Payment' : 'Confirm Payment'}
      </h1>
      <form>
        {props.to !== 'confirm-payment' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Payment Proof
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        )}

        {preview && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="flex justify-center">
              <Image
                src={preview}
                alt="Image Preview"
                width={192}
                height={192}
                className="w-48 h-auto max-h-96 rounded-lg border"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <a
            className="p-2 mr-2 border border-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={() => props.onClose(false)}
          >
            Close
          </a>
          {props.to == 'confirm-payment' && (
            <a
              className="p-2 mr-2 border bg-red-400 rounded-md cursor-pointer hover:font-bold"
              onClick={() => handleConfirmPayment(props.order.id, 'rejected')}
            >
              Reject Payment
            </a>
          )}
          <a
            className="p-2 border bg-secondary rounded-md cursor-pointer hover:font-bold"
            onClick={
              props.to === 'confirm-payment'
                ? () => handleConfirmPayment(props.order.id, 'accepted')
                : handlePayment
            }
          >
            {props.to == 'confirm-payment'
              ? 'Confirm Payment'
              : 'Upload Payment'}
          </a>
        </div>
      </form>
    </div>
  );
}
