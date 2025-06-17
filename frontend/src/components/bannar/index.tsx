import BigBannar from "./big-bannar";
import SmallBannar1 from "./small-bannar1";
import SmallBannar2 from "./small-bannar2";

export default function Bannar() {
  return (
    <div className="w-full h-[600px] py-4 flex gap-6">
      <div className="w-[872px] h-full">
        <BigBannar />
      </div>
      <div className="h-[600px] flex flex-col gap-6">
        <div className="w-[423px] h-[288px]">
          <SmallBannar1 />
        </div>
        <div className="w-[423px] h-[288px]">
          <SmallBannar2 />
        </div>
      </div>
    </div>
  );
}
