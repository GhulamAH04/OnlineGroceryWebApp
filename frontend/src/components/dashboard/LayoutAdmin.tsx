import SidebarAdmin from "./SidebarAdmin";

const LayoutAdmin = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
    <div className="w-1/4">
      <SidebarAdmin />
    </div>
    <div className="flex-1 space-y-4">{children}</div>
  </div>
);

export default LayoutAdmin;
