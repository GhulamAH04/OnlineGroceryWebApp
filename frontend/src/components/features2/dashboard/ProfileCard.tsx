/*
import Image from "next/image";

// Tombol kustom untuk digunakan di beberapa tempat
const EditButton = ({ children }: { children: React.ReactNode }) => (
  <button className="text-sm font-semibold text-green-600 hover:underline">
    {children}
  </button>
);

export default function UserInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      // Kolom Profil
      <div className="p-6 bg-white rounded-lg shadow-md flex items-center gap-6">
        <Image
          src="/avatar-placeholder.png" // Ganti dengan path ke gambar avatar Anda di folder /public
          alt="Dianne Russell"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <h4 className="font-bold text-gray-800">Dianne Russell</h4>
          <p className="text-sm text-gray-500">
            4517 Washington Ave. Manchester, Kentucky 39495
          </p>
          <div className="mt-2">
            <EditButton>Edit Profile</EditButton>
          </div>
        </div>
      </div>

      // Kolom Alamat Penagihan
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h4 className="font-bold text-gray-500 text-sm mb-4">
          BILLING ADDRESS
        </h4>
        <div>
          <p className="font-bold text-gray-800">Dianne Russell</p>
          <p className="text-sm text-gray-500">
            4517 Parker Rd. Allentown, New Mexico 31134
          </p>
          <p className="text-sm text-gray-500 mt-2">dainne.ressell@gmail.com</p>
          <p className="text-sm text-gray-500">(671) 555-0110</p>
        </div>
        <div className="mt-3">
          <EditButton>Edit Address</EditButton>
        </div>
      </div>
    </div>
  );
}
*/