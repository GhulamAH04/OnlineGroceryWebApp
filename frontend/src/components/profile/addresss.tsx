import { IAddress } from "@/interfaces/address.interface";

interface BillingAddressProps {
  address: IAddress;
}

export default function Address({ address }: BillingAddressProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
        Billing Address
      </h3>
      <address className="not-italic text-gray-700 space-y-2">
        <p>{address.street}</p>
        <p>{address.email}</p>
        <p>{address.phone}</p>
      </address>
      <button className="text-green-600 font-semibold hover:underline mt-4">
        Edit Address
      </button>
    </div>
  );
}
