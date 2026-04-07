const reports = [
  {
    date: "Oct 24, 13:28",
    category: "Illegal Mining",
    location: "Atiwa Forest",
    status: "Confirmed",
  },
  {
    date: "Sep 23, 2022",
    category: "Floods",
    location: "Kaneshie, Accra",
    status: "Confirmed",
  },
  {
    date: "Aug 10, 12:58",
    category: "Wildfire",
    location: "Mole National Park",
    status: "Confirmed",
  },
  {
    date: "Jun 21, 14:00",
    category: "Others",
    location: "Kibi",
    status: "Pending",
  },
  {
    date: "Jul 12, 22:45",
    category: "Illegal Mining",
    location: "Odumase",
    status: "Confirmed",
  },
];

const StatusPill = ({ status }: { status: string }) => {
  const styles =
    status === "Confirmed"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-amber-50 text-amber-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${styles}`}
    >
      {status}
    </span>
  );
};

const ReportsTable = () => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="mb-3 text-base font-semibold text-slate-800">
          Recent Reports Moderation
        </h3>
        <button className="text-xs font-medium text-blue-600 hover:underline">
          View all reports →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] case tracking-wide text-slate-400">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr
                key={`${report.date}-${report.location}`}
                className="border-b border-slate-50 last:border-0"
              >
                <td className="py-4 text-sm text-slate-500">{report.date}</td>
                <td className="py-4 text-sm font-medium text-slate-700">
                  {report.category}
                </td>
                <td className="py-4 text-sm text-slate-500">
                  {report.location}
                </td>
                <td className="py-4 text-sm">
                  <StatusPill status={report.status} />
                </td>
                <td className="py-4 text-right text-sm">
                  <button className="font-medium text-blue-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;