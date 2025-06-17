interface props {
    number: number;
    time: string;
}
export default function Timer({number, time}:props) {
    return (
      <div className="w-[56px] h-[52px]">
        <p className="W-[56px] h-[36px] text-2xl text-center text-[#FFFFFF]">{number}</p>
        <p className="text-xs text-center text-[#FFFFFF]">{time}</p>
      </div>
    );
}