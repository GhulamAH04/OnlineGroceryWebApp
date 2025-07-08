export default function StatusOrder({ status }: { status: string }) {
  const statusColor: { [key: string]: string } = {
    UNPAID: 'bg-gray-500',
    PAID: 'bg-purple-500',
    PROCESSING: 'bg-blue-500',
    SHIPPED: 'bg-indigo-500',
    DELIVERED: 'bg-purple-500',
    COMPLETE: 'bg-green-500',
    CANCELED: 'bg-red-500',
  };

  return (
    <div className="flex items-center">
      <p
        className={`${status == 'DELIVERED' ? 'bg-green-500' : statusColor[status]} text-white px-2 py-1 rounded-md`}
      >
        {status == 'DELIVERED'
          ? 'COMPLETE'
          : status == 'PAID'
            ? 'CONFIRM PAYMENT'
            : status}
      </p>
    </div>
  );
}
