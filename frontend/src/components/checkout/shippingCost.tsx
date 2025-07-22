interface ShippingData {
  cost: number;
  eta: string;
}

const ShippingCost = ({cost, eta}: ShippingData) => (
  <div className="py-2 border-t border-gray-200 grid md:grid-cols-5 gap-4 items-center">
    <div className="md:col-span-2">
      <p className="text-sm text-gray-600">Biaya Pengiriman</p>
    </div>
    <div className="md:col-span-3 text-left md:text-right">
      <div className="flex justify-start md:justify-end items-center">
        <p className="text-sm font-semibold">
          Rp{cost.toLocaleString("id-ID")}
        </p>
      </div>
      <p className="text-xs text-gray-500">Perkiraan sampai: {eta}</p>
    </div>
  </div>
);

export default ShippingCost;
