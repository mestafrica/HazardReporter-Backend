import { useEffect, useState } from "react";
import PostHazzardReportUi from "../components/PostHazzardReportUi";
import RecentPostCard from "../components/RecentPostCard";
import TrendingPostCard from "../components/TrendingPostCard";
import { HazardReport } from "../types/hazardreport";
import { apiGetAllHazardReports, apiGetTrendingHazardReports } from "../services/api";
import { announcement } from "..";
import AirQuality from "../components/AirQuality";
import { useAuth } from "../context/AuthContext";
// import landingImage from '../assets/images/landing.png';

// Define the expected API response
interface HazardResponse {
  hazardReports: HazardReport[];
}

export default function DashboardHomePage() {
const { user } = useAuth();

  const [hazards, setHazards] = useState<HazardReport[]>([]);
  const [trendinghazards, setTrendingHazards] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHazards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = (await apiGetAllHazardReports()) as unknown as {
        data: HazardResponse;
      };
      setHazards(response.data.hazardReports || []);
    } catch (err) {
      console.error("Error fetching hazards:", err);
      setError("Failed to load hazard reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get Hazards with Highest Upvotes
    const getTrendingHazards = async () => {
    try {
      const response = (await apiGetTrendingHazardReports()) as unknown as {
        data: HazardResponse;
      };
      setTrendingHazards(response.data.hazardReports || []);
    } catch (err) {
      console.error("Error fetching trending hazards:", err);
    }
  };
  

  // fetch on mount
  useEffect(() => {
    fetchHazards();
    getTrendingHazards();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchHazards}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container space-y-10">
        <div className="w-[95%] mx-auto">
          <div className="flex gap-x-4 my-4 md:my-6 ">

            {/* 🔥 CONDITIONAL UI HERE */}
            <div className=" bg-white rounded-md md:w-2/3 w-full md:h-[200px] shadow-sm  ">
              {user ? (
                <PostHazzardReportUi onSuccess={fetchHazards} />
              ) : (
                <div className="bg-[url('./assets/images/clean-dirty-environment.png')] bg-cover bg-center bg-no-repeat rounded-lg shadow-md md:h-[200px]">
                <div className="p-6 text-center bg-black/20 rounded-lg backdrop-brightness-75 md:h-[200px] flex flex-col justify-center items-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Environmental Hazard Reporting
                  </h3>

                  <p className="text-white mb-4">
                    A Critical Step Towards a Safer Planet
                  </p>

                  <a
                    href="/login"
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Make a report
                  </a>
                </div>
                </div>
              )}
            </div>

            <div className="hidden md:block bg-white md:w-1/3 w-full rounded-md shadow-sm ">
              <AirQuality />
            </div>
          </div>
          <section className="mb-8 hidden md:block">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Trending Hazard Post ⚡
              </h2>
              <a
                href="#!"
                className="text-blue-600 font-medium hover:underline"
              >
                View all
              </a>
            </div>
            <div className="w-[calc(100vw-255px)] overflow-x-scroll flex gap-6">
              {trendinghazards.length > 0 ? (
                trendinghazards.map((hazard) => (
                  <TrendingPostCard key={hazard._id} hazard={hazard} />
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-32 text-gray-500">
                  No trending hazards available
                </div>
              )}
            </div>
          </section>
          {/* <HazardReport /> */}

          <div className="flex gap-6 md:w-full">
            {/* Recent Post Section */}
            <section className="mb-8 w-full">
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
                {hazards.length > 0 ? (
                  hazards.map((hazard) => (
                    <RecentPostCard key={hazard._id} hazard={hazard} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No hazard reports found</p>
                    <button
                      onClick={fetchHazards}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Announcement Section */}
            <section className=" md:w-[65%] hidden md:block sticky top-20 h-[80vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Announcement
                </h2>
              </div>
              <div className="sticky top-20 h-[80vh] bg-white overflow-y-auto scrollbar-thick scrollbar-thumb-gray-100 scrollbar-track-gray-100 rounded-lg shadow-sm hover:shadow-md transition">
                <div className=" rounded-lg">
                  {announcement.map((post) => (
                    <div
                      key={post.id}
                      className="w-[95%] mx-auto rounded-lg flex gap-2 mb-3  justify-center items-center"
                    >
                      <div className="bg-red-400 w-40 h-20 m-2 rounded-lg">
                        <img
                          // src={post.profileImage}
                          src={post.profileImage}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 leading-5">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500">{post.date}</p>
                        <p className="text-sm text-gray-700 leading-4">
                          {post.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
