import { CiShare2 } from "react-icons/ci";
import { HazardReport } from "../types/hazardreport";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CircleArrowUp } from "lucide-react";
import { apiUpvoteHazard } from "../services/api";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";

dayjs.extend(relativeTime);

interface RecentPostProps {
  readonly hazard: HazardReport;
  readonly onEdit?: (hazard: HazardReport) => void;
}

const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "";

export default function RecentPostCard({ hazard, onEdit }: Readonly<RecentPostProps>) {
  const { user } = useAuth();

  const [upvotes, setUpvotes] = useState(hazard.upvotes ?? 0);
  const [upvotedBy, setUpvotedBy] = useState<string[]>(hazard.upvotedBy ?? []);

  const userId = user?.id;

  const canEdit =
  !!userId &&
  hazard.user?._id === userId &&
  dayjs().diff(dayjs(hazard.createdAt), "hour", true) < 1;

  // FIXED REAL TIME TOGGLE CHECK
  const hasUpvoted = userId ? upvotedBy.includes(userId) : false;

  const handleUpvote = async () => {
    if (!userId) return toast.error("Please login to upvote");

    try {
      const res = await apiUpvoteHazard(hazard._id);

      const updated = res.data.hazardReport;

      // update counts
      setUpvotes(updated.upvotes);

      // update list of users that have upvoted
      setUpvotedBy(updated.upvotedBy);
    }catch (err: unknown) {
  const backendMsg =
    err && typeof err === "object" && "response" in err
      ? (err as {
          response?: { data?: { message?: string } };
        }).response?.data?.message
      : undefined;

  toast.error(backendMsg || "Upvote failed");
  console.error("Upvote failed:", err);
}
  };

  const handleEditClick = () => {
    if (!canEdit) return;
    onEdit?.(hazard);
  };

  return (
    <>
      <div className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition">
        <div className="flex items-center mb-4">
          <img alt="" className="w-12 h-12 rounded-full mr-3 bg-red-200" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {hazard.user?.userName ?? "Anonymous"}
            </h3>
            <p
              className="text-sm text-gray-500"
              title={dayjs(hazard.createdAt).format("MMM D, YYYY h:mm A")}
            >
              {dayjs(hazard.createdAt).fromNow()}
            </p>
          </div>
        </div>

        <div>
          <p className="text-gray-700 mb-4">{hazard.description}</p>
          <div className="flex items-center gap-x-[1rem] overflow-y-hidden">
            {hazard.images && hazard.images.length > 0 ? (
              <div className="flex gap-2">
                {hazard.images.map((img) => {
  const imageSrc =
    img.startsWith("http://") || img.startsWith("https://")
      ? img
      : `${baseUrl}/${img}`;

  return (
    <img
      key={img}
      src={imageSrc}
      alt={`Hazard: ${hazard.title}`}
      className="w-full h-48 object-cover rounded-xl mb-4"
    />
      );
})}
              </div>
            ) : (
              <div className="w-full h-48 rounded-xl bg-gray-200 items-center justify-center hidden">
                <span className="text-gray-500 text-sm">No image</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <span className="flex items-center gap-2">
            <CircleArrowUp
              onClick={handleUpvote}
              className={`cursor-pointer transition 
                ${hasUpvoted ? "text-blue-600" : "text-gray-400"}`}
            />
            {`${upvotes} upvotes`}
          </span>

          <div className="flex items-center gap-4">
           {canEdit && (
          <button
           onClick={handleEditClick}
           className="text-sm text-blue-600 hover:underline">
           Edit
          </button> )}

          <span className="flex items-center gap-2">
            <CiShare2 /> share
          </span>
        </div>
      </div>
      </div>
      <ToastContainer />
    </>
  );
}
