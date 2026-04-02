import dashboardIcon from "../assets/images/dashboardIcon.png";
import mapIcon from "../assets/images/mapIcon.png";
import avatarIcon from "../assets/images/profile.png";
import bellIcon from "../assets/images/bellIcon.png";
import messagesIcon from "../assets/images/messagesIcon.png";
import { ROUTES } from "../constants/routes";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="">
      <nav className="md:w-[98%] flex md:flex justify-between items-center px-4 py-4 md:p-6">
        <div className="hidden md:flex">
          <h2 className="font-semibold text-md">Home</h2>
        </div>
        {isLoggedIn ? (
          <div className="flex justify-between items-center w-full md:w-full md:gap-x-10">
            <div className="flex flex-1 justify-center items-center space-x-4 ">
              <div className="hidden md:flex space-x-2 border justify-between items-center rounded-full w-[262px] h-[36px] bg-[#F2F2F2]">
                <Link
                  to={`/${ROUTES.dashboard}`}
                  className="flex items-center px-3 py-1 rounded-full text-gray-500 hover:text-black hover:bg-white space-x-2"
                >
                  <img
                    src={dashboardIcon}
                    alt="Dashboard Icon"
                    className="w-[16px] h-[16px]"
                  />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/map"
                  className="flex items-center px-3 py-1 rounded-full text-gray-500 hover:text-black hover:bg-white space-x-2"
                >
                  <img
                    src={mapIcon}
                    alt="Map Icon"
                    className="w-[16px] h-[16px]"
                  />
                  <span>Map View</span>
                </Link>
              </div>
            </div>
            <div className="w-full flex justify-between md:w-fit md:flex md:items-center md:space-x-3">
              {/* App Name */}
              <div className="flex  md:hidden">
                <h1 className="">
                  <span className="font-bold">GH-HAZARD</span> <br />
                </h1>
              </div>

              <div className="md:flex md:items-center md:space-x-2">
                <img
                  src={avatarIcon}
                  alt="Profile Avatar"
                  className="w-9 h-9 rounded-full"
                />
                <div className="hidden md:flex md:flex-col md:leading-tight">
                  <p className="text-sm text-gray-500">
                    {user?.userName || "User"}
                  </p>
                </div>
                <div className="hidden md:flex relative">
                  <img
                    src={bellIcon}
                    alt="bell Icon"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>

                <img
                  src={messagesIcon}
                  alt="messages Icon"
                  className="hidden md:flex w-8 h-8 rounded-full"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center md:flex  md:gap-x-10 w-full md:w-fit">
            <div className="flex md:hidden">
              <h1 className="mr-auto">
                <span className="font-bold">GH-HAZARD</span> <br />
              </h1>
            </div>

            <div className="flex gap-x-3">
              <Link
                to="/login"
                className="px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
