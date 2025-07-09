import Feature from "./feature";

export default function Featured() {
  return (
    <div className="w-full max-w-[1320px] mx-auto my-4 p-4 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Feature
          icon="truck"
          title="Free Shipping"
          desc="Free shipping on all your order"
        />
        <Feature
          icon="headset"
          title="24/7 Support"
          desc="Instant access to Support"
        />
        <Feature
          icon="bag"
          title="Secure Payment"
          desc="We ensure your money is safe"
        />
        <Feature
          icon="box"
          title="Money-Back Guarantee"
          desc="30 Days Money-Back"
        />
      </div>
    </div>
  );
}
