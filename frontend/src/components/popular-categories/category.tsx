interface props {
    image: string;
    name: string;
}

export default function name({image, name}: props) {
    return (
      <div className="w-[200px] h-[200px] text-[#1A1A1A] flex flex-col justify-center items-center gap-4 border border-[#E5E5E5] rounded-[5px] hover:border-[#2C742F] hover:shadow-xl/25 hover:text-[#2C742F]">
        {/* eslint-disable-next-line */}
        <img
          className="w-[190px] h-[130px]"
          src={`/popular-categories/${image}.png`}
          alt={image}
        />
        <p className="text-[18px] font-semibold">{name}</p>
      </div>
    );
}