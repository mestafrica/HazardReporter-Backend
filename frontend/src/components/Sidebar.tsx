import { Link, useLocation, useNavigate } from "react-router-dom";
// import overviewIcon from "../assets/images/overviewIcon.png"; => Overview hidden for now
import homeIcon from "../assets/images/homeIcon.png";
import mapIcon from "../assets/images/mapIcon.png";
import SettingsIcon from "../assets/images/settingsIcon.png";
// import LogOutIcon from "../assets/images/logOutIcon.png";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../context/AuthContext";
import { LogIn, LogOut } from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // dashboard is the home
  };

  const navItems = [
    { to: `${ROUTES.dashboard}`, icon: homeIcon, label: "Home" },
    // { to: "/overview", icon: overviewIcon, label: "Overview" }, => Overview hidden for now
    { to: "/map", icon: mapIcon, label: "Map" },
  ];

  const bottomItems = [
    { to: "/settings", icon: SettingsIcon, label: "Settings" },
    // { to: "/login", icon: LogOutIcon, label: "Logout" },
  ];

  return (
    <>
      {/* ===== Desktop Sidebar (unchanged) ===== */}
      <aside className="hidden md:w-[15%] fixed md:flex bg-[#FFFFFF] h-screen text-sm p-4">
        <nav className="flex flex-col justify-between w-[95%] mx-auto">
          <div className="space-y-4">
            <h1 className="h-[43px] space-y-2 leading-none mt-[20px] mb-6">
              <span className="font-bold">GH-HAZARD</span> <br />
              <span className="text-[0.7rem]">Report</span>
            </h1>

            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`text-gray-700 flex items-center h-[35px] p-2 hover:bg-[#E8E8EA] rounded-[4px] gap-[8px] ${
                  location.pathname === item.to ? "bg-[#E8E8EA]" : ""
                }`}
              >
                <img
                  src={item.icon}
                  alt={`${item.label} Icon`}
                  className="w-[16px] h-[16px]"
                />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            {isLoggedIn ? (
              <>
                {bottomItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`text-gray-700 flex items-center h-[35px] p-2 hover:bg-[#E8E8EA] rounded-[4px] gap-[8px] ${
                      location.pathname === item.to ? "bg-[#E8E8EA]" : ""
                    }`}
                  >
                    <img
                      src={item.icon}
                      alt={`${item.label} Icon`}
                      className="w-[16px] h-[16px]"
                    />
                    <span>{item.label}</span>
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="text-gray-700 flex items-center h-[35px] p-2 hover:bg-[#E8E8EA] rounded-[4px] gap-[6px] w-full"
                >
                  <LogOut className="w-[20px] h-[20px]" />
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden"></div>
            )}
          </div>
        </nav>
      </aside>

      {/* ===== Mobile Bottom Navigation ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-sm flex justify-around items-center h-[60px] md:hidden">
        {/* Home + Map always appear */}
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center transition-all duration-200 ${
                active ? "text-black scale-105" : "text-gray-500"
              }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={`w-[22px] h-[22px] ${
                  active ? "opacity-100" : "opacity-70"
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-medium ${
                  active ? "text-black" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* ===== When Logged In ===== */}
        {isLoggedIn ? (
          <>
            {/* Settings */}
            <Link
              to="/settings"
              className="flex flex-col items-center justify-center text-gray-500"
            >
              <img src={SettingsIcon} className="w-[22px] h-[22px]" />
              <span className="text-[10px] mt-1 font-medium">Settings</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center text-gray-500"
            >
              <LogOut className="w-[22px] h-[22px]" />
              <span className="text-[10px] mt-1 font-medium">Logout</span>
            </button>
          </>
        ) : (
          /* ===== When NOT Logged In ===== */
          <button
            onClick={() => navigate("/login")}
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <LogIn className="w-[22px] h-[22px]" />
            <span className="text-[10px] mt-1 font-medium">Login</span>
          </button>
        )}
      </nav>
    </>
  );
};

export default Sidebar;
