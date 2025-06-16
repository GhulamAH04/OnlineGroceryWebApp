import Bannar from "@/components/bannar";
import Featured from "@/components/featured";
import Navbar from "@/components/navigation";

export default function Homepage() {
  return (
    <>
      <Navbar/>
      <div className="px-[300px]">
        <Bannar/>
        <Featured/>
      </div>
    </>
  );
}
