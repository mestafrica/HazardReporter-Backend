import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  badge: string;
};

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  badge,
}: StatCardProps) => {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${badge}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-semibold text-emerald-500">{change}</span>
      </div>

      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{title}</p>
    </div>
  );
};

export default StatCard;