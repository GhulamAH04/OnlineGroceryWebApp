import { ArrowRight } from "lucide-react";

interface props{
  background: string;
  textColour: string;
}

export default function ShopButton({background, textColour}: props) {
    return (
      <button className={`w-[191px] h-[51px] bg-[${background}] rounded-4xl text-[16px] font-bold flex justify-center items-center gap-4 text-[${textColour}]`}>
        Shop Now <ArrowRight />
      </button>
    );
}