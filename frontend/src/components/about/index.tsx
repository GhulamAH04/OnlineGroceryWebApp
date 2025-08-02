import {
  CreditCardIcon,
  HeadphonesIcon,
  LeafIcon,
  StarIcon,
  TruckIcon,
} from "lucide-react";
import FeatureItem from "./featureItem";
import Link from "next/link";

// --- Main Page Component ---
export default function AboutPage() {
  return (
    <div className="bg-white font-sans">
      <main>
        {/* Section 1: Trusted Store */}
        <section className="py-12 md:py-8">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  100% Trusted Organic Food Store
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Farm-fresh produce to nourishing pantry staples, we provide
                  you and your family with the peace of mind that comes from
                  eating clean, authentic food. Shop with confidence and taste
                  the delicious difference that nature intended.
                </p>
              </div>
              <div className="flex justify-center">
                {/* eslint-disable-next-line */}
                <img
                  src="/about/happyfarmer1.jpg"
                  alt="Happy farmer with fresh vegetables"
                  className="rounded-lg shadow-2xl w-full max-w-md object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Features */}
        <section className="py-12 md:py-8">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="h-full order-2 md:order-1 flex justify-center">
                {/* eslint-disable-next-line */}
                <img
                  src="/about/happyfarmer2.jpg"
                  alt="Man holding a basket of fresh organic vegetables"
                  className="rounded-lg w-full max-w-md object-cover"
                />
              </div>
              <div className="order-1 md:order-2 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  100% Reliable Grocery Store
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Refuel your body and spirit with the authentic taste of nature
                  it is the wellness you and your family deserve.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <FeatureItem
                    icon={<LeafIcon />}
                    title="100% Organic food"
                    subtitle="100% healthy & fresh food"
                  />
                  <FeatureItem
                    icon={<HeadphonesIcon />}
                    title="Great Support 24/7"
                    subtitle="Instant access to contact"
                  />
                  <FeatureItem
                    icon={<StarIcon />}
                    title="Customer Feedback"
                    subtitle="Our happy customer"
                  />
                  <FeatureItem
                    icon={<CreditCardIcon />}
                    title="100% Secure Payment"
                    subtitle="We ensure your money is save"
                  />
                  <FeatureItem
                    icon={<TruckIcon />}
                    title="Free Shipping"
                    subtitle="Free organic products delivery"
                  />
                  <FeatureItem
                    icon={<LeafIcon />}
                    title="100% Organic Food"
                    subtitle="100% healthy & fresh food"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Delivery */}
        <section className="py-12 md:py-8">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                  We Delivered, You Enjoy Your Order.
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Of course! Here is a caption perfect for a delivery
                  confirmation on a Saturday afternoon. Header: The Best Part
                  Starts Now! Caption: Your trusted selection of fresh, organic
                  goodness has been delivered right to your doorstep. As you
                  unpack your order this lovely Saturday afternoon, we hope you
                  feel the excitement of the delicious, healthy meals to come.
                </p>
                <Link
                  href="/shop"
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-colors duration-300 shadow-lg"
                >
                  Shop Now
                </Link>
              </div>
              <div className="h-full flex justify-center">
                {/* eslint-disable-next-line */}
                <img
                  src="/about/delivery.jpg"
                  alt="Friendly delivery person with a crate of groceries"
                  className="rounded-lg w-full max-w-md object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
