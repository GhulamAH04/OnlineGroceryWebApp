interface ToastMessage {
  message: string;
  status: string;
}

interface NotificationToastProps {
  toastMessage: ToastMessage;
}

export default function NotificationToast({
  toastMessage,
}: NotificationToastProps) {
  return (
    <div>
      {toastMessage.message && (
        <div
          className="toast toast-top toast-end"
          style={{
            position: 'fixed',
            top: '3rem',
            right: '1rem',
            zIndex: 1000,
          }}
        >
          <div
            className={`alert ${
              toastMessage.status == 'success' ? 'alert-success' : 'alert-error'
            }`}
          >
            <span className="text-primary text-bold">
              {toastMessage.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
