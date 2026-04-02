import { useEffect, useState } from "react";
import PostHazzardReportUi from "../components/PostHazzardReportUi";
import RecentPostCard from "../components/RecentPostCard";
import TrendingPostCard from "../components/TrendingPostCard";
import { HazardReport } from "../types/hazardreport";
import { apiGetAllHazardReports } from "../services/api";

export default function DashboardHomePage() {
  const [hazards, setHazards] = useState<HazardReport[]>([]);

  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const response = await apiGetAllHazardReports();
        setHazards(response.data.hazardReports);
        console.log(response.data.hazardReports);
      } catch (err) {
        console.error("Render error:", err);
        return <p className="text-red-500 font-bold">Something went wrong</p>;
      }
    };

    fetchHazards();
  }, []);

  return (
    <>
      <div className="container mx-auto space-y-10">
        <div className="flex gap-x-3 ">
          <div className=" bg-white rounded-md w-2/3">
            <PostHazzardReportUi />
          </div>
        </div>
        <section className="mb-8 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md font-bold text-gray-800">
              Trending Hazard Post ⚡
            </h2>
            <a href="#!" className="text-blue-600 font-medium hover:underline">
              View all
            </a>
          </div>
          <div className="w-[calc(100vw-320px)] overflow-x-scroll flex gap-6">
            {hazards.length > 0 &&
              hazards.map((hazard) => (
                <TrendingPostCard key={hazard._id} hazard={hazard} />
              ))}
          </div>
        </section>
        {/* <HazardReport /> */}
        <div className="flex gap-6">
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Post</h2>
              <a
                href="#!"
                className="text-blue-600 font-medium hover:underline"
              >
                View all
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {hazards.length > 0 &&
                hazards.map((hazard) => (
                  <RecentPostCard key={hazard._id} hazard={hazard} />
                ))}
            </div>
          </section>

          {/* <Announcement /> */}
        </div>
      </div>
    </>
  );
}
