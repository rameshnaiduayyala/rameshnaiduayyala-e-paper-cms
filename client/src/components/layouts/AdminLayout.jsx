// src/layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
// import AdminHeader from "../../pages/adminPages/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* <AdminHeader /> */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
