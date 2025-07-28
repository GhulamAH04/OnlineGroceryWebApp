import Checkout from "@/components/checkout";

export default function CheckoutPage() {
  return (
    <div className="2xl:px-[300px] xl:px-[150px] 2xl:pb-8 xl:pb-4">
      <div className="min-h-screen font-sans">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <main>
            <Checkout />
          </main>
        </div>
      </div>
    </div>
  );
}
