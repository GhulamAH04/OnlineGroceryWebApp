import { PhoneCall } from "lucide-react";

export default function NavLinks() {
    const links = ["Home", "Shop", "Pages", "Blog", "About Us", "Contact Us"]
    return (
      <div className="h-[60px] bg-[#333333] text-[#666666] text-xs flex justify-between px-[300px] py-[19.5px]">
        <ul className="h-[21px] w-[535px] flex gap-4">
          {links.map((link, index) => (
            <li key={index} className="inline-block mx-2">
              <a
                href="#"
                className="text-[#999999] text-[14px] hover:text-white active:text-white"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center text-white gap-2 py-[3.5px] w-[139px] h-[28px]">
          <PhoneCall width={28} height={28} />
          <p className="text-[14px]">(219) 555-0114</p>
        </div>
      </div>
    );
}