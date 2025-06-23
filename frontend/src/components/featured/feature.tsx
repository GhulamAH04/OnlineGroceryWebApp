interface props {
    icon: string;
    title: string;
    desc: string;
}

export default function Feature({icon, title, desc}: props) {
  return (
    <div className="w-[306px] h-[48px] flex justify-center items-center gap-2">
      {/* eslint-disable-next-line */}
      <img
        className="w-10 h-10 text-[#00B207]"
        src={`/featured/${icon}.svg`}
        alt={icon}
      />
      <div className="w-[250px] h-[48px]">
        <p className="text-[16px] text-[#1A1A1A] font-semibold">{title}</p>
        <p className="text-[14px] text-[#999999] font-normal">{desc}</p>
      </div>
    </div>
  );
}
