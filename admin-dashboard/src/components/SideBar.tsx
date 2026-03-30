import {
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldAlert,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Content Moderation", icon: ShieldAlert, active: false },
  { label: "Announcement", icon: Megaphone, active: false },
  { label: "User Management", icon: Users, active: false },
  { label: "Settings", icon: Settings, active: false },
];

const Sidebar = () => {
  return (
    <aside className="self-start min-h-[620px] flex-col bg-white px-5 py-6 lg:border-r lg:border-slate-200">
      <div className="mb-8 flex items-center gap-2">
        <div>
          <p className="text-sm font-bold text-blue-700">Gh-Hazard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                item.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
            
          );
        })}
      </nav>
<div className="mt-56 -mx-5 border-t border-slate-200">
  <div className="px-5 pt-4">
    <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
      + New Report
    </button>
  </div>
</div>
</aside>
  );
};

export default Sidebar;