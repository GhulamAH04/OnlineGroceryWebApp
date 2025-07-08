interface props {
    number: number;
    time: string;
    textColor: string;
}
export default function Timer({number, time, textColor}:props) {
    return (
      <div className="w-[56px] h-[52px]">
        <p className={`W-[56px] h-[36px] text-2xl text-center text-[${textColor}]`}>{number}</p>
        <p className={`text-xs text-center text-[${textColor}]`}>{time}</p>
      </div>
    );
}