import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
