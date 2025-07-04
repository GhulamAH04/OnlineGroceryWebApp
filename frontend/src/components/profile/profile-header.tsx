import { IUser } from "@/interfaces/auth.interface";

interface ProfileHeaderProps {
  user: IUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
        {/* eslint-disable-next-line */}
        <img
          src={user.image}
          alt="User Avatar"
          width={100}
          height={100}
          className="object-cover w-full h-full"

        />
      </div>
      <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
      <p className="text-gray-500 mb-4">{user.role}</p>
      <button className="text-green-600 font-semibold hover:underline">
        Edit Profile
      </button>
    </div>
  );
}
