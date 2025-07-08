import { logout } from '@/api/auth';
import { sidebarAdmin, sidebarSuperadmin } from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = (props: { role: string }) => {
  const pathname = usePathname();
  const sidebarItems =
    props.role === 'SUPER_ADMIN' ? sidebarSuperadmin : sidebarAdmin;

  return (
    <aside className="bg-secondary w-64 h-screen fixed top-0 left-0 z-50">
      <div className="flex items-center justify-center h-14">
        <Link href="/dashboard">
          <Image src="/logo.png" alt="Groceria" width={150} height={25} />
        </Link>
      </div>
      <nav className="px-4 mt-4">
        <ul>
          {sidebarItems?.map((sidebar) => (
            <li key={sidebar.id} className="p-2">
              <Link
                className={pathname === sidebar.link ? 'active' : 'nav-link'}
                href={sidebar.link}
              >
                {sidebar.title}
              </Link>
            </li>
          ))}
          <hr className="my-2 border-black border" />
          <li className="p-2">
            <Link
              href="/auth/login"
              className="hover:font-bold"
              onClick={() => {
                async function deleteSession() {
                  await logout();
                  window.location.href = '/auth/login';
                }
                deleteSession();
              }}
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
