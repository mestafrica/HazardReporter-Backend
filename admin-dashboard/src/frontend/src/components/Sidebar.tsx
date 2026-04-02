import { Link } from "react-router-dom";
import overviewIcon from "../assets/images/overviewIcon.png";
import homeIcon from "../assets/images/homeIcon.png";
import mapIconIcon from "../assets/images/mapIcon.png";
import SettingsIcon from "../assets/images/settingsIcon.png";
import LogOutIcon from "../assets/images/logOutIcon.png";
import { ROUTES } from "../constants/routes";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[239px] bg-[#FFFFFF] h-screen text-sm p-4">
      <nav className="flex flex-col h-full justify-between">
        <div className="space-y-4">
          <h1 className="h-[43px] ml-5 mt-[20px] mb-6">
            <span className="font-bold">GH-HAZARD</span> <br />
            <span className="text-[0.7rem]">Report</span>
          </h1>

          <Link
            to={`/${ROUTES.dashboard}`}
            className="text-gray-700 flex items-center h-[35px] p-2 hover:bg-[#E8E8EA] active:bg-[#E8E8EA] focus:outline-none focus:ring focus:ring-[#E8E8EA] rounded-[4px] gap-[8px]"
          >
            <img src={homeIcon} alt="Home Icon" className="w-[16px] h-[16px]" />
            Home
          </Link>
          <Link
            to="overview"
            className="text-gray-700 flex items-center h-[35px] p-2 hover:bg-[#E8E8EA] active:bg-[#E8E8EA] focus:outline-none focus:ring focus:ring-[#E8E8EA] rounded-[4px] gap-[8px]"
          >
            <img
              src={overviewIcon}
              alt="Overview Icon"
              className="w-[16px] h-[16px]"
            />
            Overview
          </Link>

          <Link
            to="/dashboard/map"
            className="text-gray-700 flex items-center h-[35px] p-2 hover:bg-[#E8E8EA] active:bg-[#E8E8EA] focus:outline-none focus:ring focus:ring-[#E8E8EA] rounded-[4px] gap-[8px]"
          >
            <img
              src={mapIconIcon}
              alt="Map Icon"
              className="w-[16px] h-[16px]"
            />
            Map
          </Link>
        </div>

        <div className="space-y-4">
          <Link
            to="settings"
            className="text-gray-700 flex items-center h-[35px] p-2 hover:bg-[#E8E8EA] active:bg-[#E8E8EA] focus:outline-none focus:ring focus:ring-[#E8E8EA] rounded-[4px] gap-[8px]"
          >
            <img
              src={SettingsIcon}
              alt="Settings Icon"
              className="w-[16px] h-[16px]"
            />
            <span className="ml-1">Settings</span>
          </Link>
          <Link
            to="/login"
            className="text-gray-700 flex items-center h-[35px] p-2 hover:bg-[#E8E8EA] active:bg-[#E8E8EA] focus:outline-none focus:ring focus:ring-[#E8E8EA] rounded-[4px] gap-[8px]"
          >
            <img
              src={LogOutIcon}
              alt="LogOut Icon"
              className="w-[16px] h-[16px]"
            />
            <span className="ml-1">Logout</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
