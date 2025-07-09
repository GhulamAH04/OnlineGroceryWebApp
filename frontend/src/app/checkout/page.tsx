"use client"

import AdditionalInfo from "@/components/checkout/additional-info";
import BillingInformationForm from "@/components/checkout/billing";
import OrderSummary from "@/components/checkout/order-summary";

export default function CheckoutPage() {
    const handlePlaceOrder = () => {
    };
  return (
    <div className="2xl:px-[300px] xl:px-[150px] 2xl:pb-8 xl:pb-4">
      <div className="min-h-screen font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column: Billing and Additional Info */}
            <div className="lg:col-span-3">
              {/* We pass a ref to the form component to be able to trigger submit from the parent */}
              <BillingInformationForm/>
              <AdditionalInfo/>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-2">
              <div className="top-8">
                <OrderSummary onPlaceOrder={handlePlaceOrder} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
