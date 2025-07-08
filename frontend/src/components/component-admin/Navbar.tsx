import Image from 'next/image';

export const Navbar = (props: { users: { username: ''; image: '' } }) => {
  return (
    <header className="grid md:grid-cols-3 grid-cols-2 md:px-40 px-4 items-center bg-black top-0 z-50">
      <div className="flex gap-2 py-2 col-end-5">
        <Image
          src={
            props.users.image
              ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/profile/${props.users.image}`
              : '/user.png'
          }
          alt="user"
          width={50}
          height={50}
          className="rounded-full h-10 w-10"
        />
        <div className="content-center">
          <a className="text-white ">Hello, {props.users?.username}</a>
        </div>
      </div>
    </header>
  );
};
