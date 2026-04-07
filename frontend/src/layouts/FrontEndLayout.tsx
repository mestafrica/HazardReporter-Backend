import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const FrontEndLayout: React.FC = () => {
  return (
    <div className="w-full">
      <div>
        <Sidebar />
      </div>
      <div className="flex flex-col md:ml-[15%]">
        <div className="w-full">
          <Navbar />
        </div>

        <div className=" bg-[#f6f6f6]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FrontEndLayout;
