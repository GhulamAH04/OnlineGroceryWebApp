import Image from "next/image";

interface props {
    icon: string;
    title: string;
    desc: string;
}

export default function Feature({icon, title, desc}: props) {
  return (
    <div className="w-[306px] h-[48px] flex justify-center items-center gap-2">
      <Image className="text-[#00B207]" src={`/featured/${icon}.svg`} alt={icon} width={40} height={40}/>
      <div className="w-[250px] h-[48px]">
        <p className="text-[16px] text-[#1A1A1A] font-semibold">
          {title}
        </p>
        <p className="text-[14px] text-[#999999] font-normal">
          {desc}
        </p>
      </div>
    </div>
  );
}
