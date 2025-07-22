import ShippingCost from "./shippingCost";

interface PageProps {
  image: string;
  storeName: string;
  name: string;
  price: number;
}

const ProductItem = ({ image, storeName, name, price }: PageProps) => (
  <>
    {/* Store Name */}
    <h2 className="text-sm font-semibold text-gray-700">Store: {storeName}</h2>
    <div className="grid grid-cols-12 gap-4 items-center py-2">
      {/* Product Info */}
      <div className="col-span-12 md:col-span-6 flex items-start">
        {/* eslint-disable-next-line */}
        <img
          src={image}
          alt="Product Image"
          className="w-20 h-20 object-cover rounded-md border border-gray-200"
        />
        <div className="ml-4">
          <p className="text-sm text-gray-800">{name}</p>
        </div>
      </div>
      {/* Unit Price */}
      <div className="col-span-4 md:col-span-2 text-sm text-gray-600 text-center">
        {price}
      </div>
      {/* Quantity */}
      <div className="col-span-4 md:col-span-2 text-sm text-gray-600 text-center">
        1
      </div>
      {/* Subtotal */}
      <div className="col-span-4 md:col-span-2 text-sm text-orange-600 font-semibold text-right">
        Rp386.000
      </div>
    </div>
    <div>
        <ShippingCost cost={20000} eta="17-19 July 2025"/>
    </div>
  </>
);

export default ProductItem;
