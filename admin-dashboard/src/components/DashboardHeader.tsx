import { Bell, ChevronDown, Search } from "lucide-react";
import profileImg from "../assets/ladyprofile.png";

const DashboardHeader = () => {
  return (
    <header className="mb-6 -mx-7 -mt-7 bg-white px-7 pt-7 pb-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>

          <input
            type="text"
            placeholder="Search reports, users or locations"
            className="w-full rounded-xl bg-[#EEF4FF] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border focus:border-blue-200"
          />
        </div>

        <div className="flex items-center gap-4 self-end lg:self-auto">
          <button className="relative rounded-full bg-white p-2.5 ring-1 ring-slate-200">
            <Bell className="h-4 w-4 text-slate-500" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">
            <img
              src={profileImg}
              alt="User"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">Sarah Johnson</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;