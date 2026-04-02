import { Link } from "react-router-dom";
import dashboardIcon from "../assets/images/dashboardIcon.png";
import mapIcon from "../assets/images/mapIcon.png";
import avatarIcon from "../assets/images/avatarIcon.png";
import bellIcon from "../assets/images/bellIcon.png";
import messagesIcon from "../assets/images/messagesIcon.png";
import { ROUTES } from "../constants/routes";
import { useEffect, useState } from "react";
import { parseJwt } from "../utils/jwt";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser(decoded);
      }
    }
  }, []);

  return (
    <div>
      <nav className="flex flex-col md:flex-row justify-between items-center px-6 pt-8">
        <h1>Home</h1>

        <div className="flex flex-1 justify-center items-center space-x-4">
          <div className="flex space-x-2 border justify-between items-center rounded-full w-[262px] h-[36px] bg-[#F2F2F2]">
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
              <img src={mapIcon} alt="Map Icon" className="w-[16px] h-[16px]" />
              <span>Map View</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <img
            src={avatarIcon}
            alt="Profile Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-semibold">{user ? `${user.firstName} ${user.lastName}` : "Guest User"}</p>
            <p className="text-sm text-gray-500">{user ? user.email : "guest@example.com"}</p>
          </div>
          <div className="relative">
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
            className="w-8 h-8 rounded-full"
          />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
