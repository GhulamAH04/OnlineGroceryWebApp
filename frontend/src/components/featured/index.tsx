import Feature from "./feature";

export default function Featured() {
    return (
      <div className="w-[1320px] h-[128px] mt-8 flex items-center justify-center shadow-lg/25">
        <Feature
          icon="truck"
          title="Free Shipping"
          desc="Free shipping on all your order"
        />
        <Feature
          icon="headset"
          title="Customer Support 24/7"
          desc="Instant access to Support"
        />
        <Feature
          icon="bag"
          title="100% Secure Payment"
          desc="We ensure your money is save"
        />
        <Feature
          icon="box"
          title="Money-Back Guarantee"
          desc="30 Days Money-Back Guarantee"
        />
      </div>
    );
}