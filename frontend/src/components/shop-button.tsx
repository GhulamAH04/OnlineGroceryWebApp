import { ArrowRight } from "lucide-react";

interface Props {
  background: string;
  textColour: string;
}

export default function ShopButton({
  background,
  textColour
}: Props) {
  return (
    <button
      className={`w-full max-w-[191px] h-[51px] bg-[${background}] text-[${textColour}] rounded-full text-base font-bold flex justify-center items-center gap-3 hover:bg-opacity-90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500/50 hover:bg-orange-500 hover:text-white`}
    >
      Shop Now <ArrowRight className="w-5 h-5" />
    </button>
  );
}
