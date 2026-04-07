import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

const AdminDashboardLayout = () => {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-[28px] bg-[#f3f6fb] shadow-xl ring-1 ring-slate-200 lg:grid-cols-[240px_1fr]">
        <Sidebar />

        <main className="p-4 md:p-6 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;