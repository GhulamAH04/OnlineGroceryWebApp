"use client";

import ShippingAddress from "@/components/checkout/shippingAddress";
import OrderSummary from "@/components/checkout/orderSummary";

export default function CheckoutPage() {
  const handlePlaceOrder = () => {};
  return (
    <div className="2xl:px-[300px] xl:px-[150px] 2xl:pb-8 xl:pb-4">
      <div className="min-h-screen font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <main>
            <ShippingAddress />
            <div className="top-8">
              <OrderSummary onPlaceOrder={handlePlaceOrder} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
