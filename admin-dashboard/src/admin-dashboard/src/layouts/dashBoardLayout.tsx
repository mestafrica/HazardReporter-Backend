import Sidebar from "../components/SideBar";
import TopBar from "../components/TopBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DashboardProvider } from "../context/DashboardContext";

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-gray-50 w-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col h-screen">
          <TopBar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
