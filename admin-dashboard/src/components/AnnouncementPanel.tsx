import { MapPinned, Megaphone, Pin } from "lucide-react";

const AnnouncementPanel = () => {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-blue-600" />
        <h2 className="text-lg font-semibold">Global Announcement System</h2>
      </div>

      <textarea
        className="min-h-[180px] w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-200"
        placeholder="Compose a flood alert or environmental warning..."
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded border-slate-300" />
            <span>Pin to top of public feed</span>
          </label>

          <button className="flex items-center gap-1.5 hover:text-slate-700">
            <Pin className="h-3.5 w-3.5" />
          </button>

          <button className="flex items-center gap-1.5 hover:text-slate-700">
            <MapPinned className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex justify-end">
          <button className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            Post Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPanel;