import Bannar from "@/components/bannar";
import Navbar from "@/components/navigation";

export default function Homepage() {
  return (
    <>
      <Navbar/>
      <div className="px-[300px]">
        <Bannar/>
      </div>
    </>
  );
}
