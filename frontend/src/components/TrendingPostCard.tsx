import { CiShare2 } from "react-icons/ci";
// import { FaRegCommentDots } from "react-icons/fa6";

import { HazardReport } from "../types/hazardreport";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CircleArrowUp } from "lucide-react";
import { useState } from "react";
import { apiUpvoteHazard } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);

interface TrendingPostProps {
  hazard: HazardReport;
}

// Image variable here
const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "";

export default function TrendingPostCard({ hazard }: TrendingPostProps) {
  const { user } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [upvotes, setUpvotes] = useState(hazard.upvotes ?? 0);
  const [upvotedBy, setUpvotedBy] = useState<string[]>(hazard.upvotedBy ?? []);

  const userId = user?.id;

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
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message;
      toast.error(backendMsg || "Upvote failed");
      console.error("Upvote failed:", err);
    }
  };

  return (
    <>
      <div className="">
        <div className="w-[350px] min-w-[350px] h-full p-4 border rounded-lg shadow-sm hover:shadow-md transition">
          <div className="w-[90%] mx-auto flex items-center mb-4">
            <div className="flex items-center space-x-3">
              <img
                src="#"
                alt="avatar"
                className="w-12 h-12 rounded-full bg-red-300"
              />
              <div>
                <p className="text-md font-semibold text-gray-800">
                  {hazard.user?.userName ?? "Anonymous"}
                </p>
                <p
                  className="text-sm text-gray-500"
                  title={dayjs(hazard.createdAt).format("MMM D, YYYY h:mm A")}
                >
                  {dayjs(hazard.createdAt).fromNow()}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p
              className={`text-gray-700 mb-4 text-sm ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {hazard.description}
            </p>

            {hazard.description.length > 10 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
            <div className="flex items-center gap-x-[1rem] overflow-y-hidden">
              {hazard.images && hazard.images.length > 0 ? (
                <div className="flex gap-2">
                  {hazard.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${baseUrl}/${img}`} // prepend backend URL
                      alt={`Hazard ${hazard.title} image ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-48 rounded-xl bg-gray-200 items-center justify-center hidden">
                  <span className="text-gray-500 text-sm">No image</span>
                </div>
              )}

              {/* <img
                src="#"
                alt=""
                className="w-full h-40 object-cover rounded-xl mb-4 bg-blue-400"
              /> */}
              {/* {post.postImage1 && (
                    <img
                      src={post.postImage1}
                      alt={post.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  {post.postImage2 && (
                    <img
                      src={post.postImage2}
                      alt={post.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )} */}
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
            {/* <span className="flex items-center gap-2">
              <FaRegCommentDots /> comment
            </span> */}
            <span className="flex items-center gap-2">
              <CiShare2 /> share
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
