import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import AnnouncementPanel from "../components/AnnouncementPanel";
import GhanaHeatMapCard from "../components/GhanaHeatMapCard";
import ReportsTable from "../components/ReportsTable";

import {
  LayoutDashboard,
  ShieldAlert,
  TriangleAlert,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Reports",
    value: "1,247",
    change: "+12.5%",
    icon: LayoutDashboard,
    badge: "bg-blue-600",
  },
  {
    title: "New Users",
    value: "3,456",
    change: "+8.3%",
    icon: Users,
    badge: "bg-emerald-600",
  },
  {
    title: "Active Hazards",
    value: "789",
    change: "+15.7%",
    icon: ShieldAlert,
    badge: "bg-red-500",
  },
  {
    title: "Pending Moderation",
    value: "74.5%",
    change: "+2.1%",
    icon: TriangleAlert,
    badge: "bg-amber-500",
  },
];

const AdminDashboardHome = () => {
  return (
    <>
      <DashboardHeader />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.7fr_0.65fr]">
       <div className="space-y-5">
       <AnnouncementPanel />
       <ReportsTable />
       </div>

       <GhanaHeatMapCard />
      </section>
    </>
  );
};

export default AdminDashboardHome;