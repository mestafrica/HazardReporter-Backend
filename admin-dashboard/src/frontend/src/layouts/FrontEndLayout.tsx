import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const FrontEndLayout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <div>
          <Navbar />
        </div>

        <div className="flex-1 p-6 bg-[#f6f6f6]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FrontEndLayout;
