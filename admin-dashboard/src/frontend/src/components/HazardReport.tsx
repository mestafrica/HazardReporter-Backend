import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { trending_posts } from "..";
import { recent_posts } from "..";
import { announcement } from "..";

const   HazardReport = () => {
  return (
    <div className="container mx-auto p-6">
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Trending Hazard Post ⚡
          </h2>
          <a href="#!" className="text-blue-600 font-medium hover:underline">
            View all
          </a>
        </div>

        <TrendingPosts />
      </section>

      <div className="flex gap-6">
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Post</h2>
            <a href="#!" className="text-blue-600 font-medium hover:underline">
              View all
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <RecentPost />
          </div>
        </section>

        <Announcement />
      </div>
    </div>
  );
};

const TrendingPosts = () => {
  return (
    <div className="w-[calc(100vw-320px)] overflow-x-scroll flex gap-6">
      {trending_posts.map((post) => (
        <div
          key={post.id}
          className="w-[350px] min-w-[350px] bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center mb-4">
            <img
              src={post.profileImage}
              alt={post.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {post.name}
              </h3>
              <p className="text-sm text-gray-500">{post.time}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-700 mb-4">{post.description}</p>
            <div className="flex items-center gap-x-[1rem] overflow-y-hidden">
              {post.postImage1 && (
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
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center gap-2">
              <CiHeart /> {post.likes}
            </span>
            <span className="flex items-center gap-2">
              <FaRegCommentDots /> {post.comment}
            </span>
            <span className="flex items-center gap-2">
              <CiShare2 /> {post.shares}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentPost = () => {
  return (
    <>
      {recent_posts.map((post) => (
        <div
          key={post.id}
          className=" bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center mb-4">
            <img
              src={post.profileImage}
              alt={post.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {post.name}
              </h3>
              <p className="text-sm text-gray-500">{post.time}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-700 mb-4">{post.description}</p>
            <div className="flex items-center gap-x-[1rem] overflow-y-hidden">
              {post.postImage1 && (
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
              )}
              {post.postImage3 && (
                <img
                  src={post.postImage3}
                  alt={post.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center gap-2">
              <CiHeart /> {post.likes}
            </span>
            <span className="flex items-center gap-2">
              <FaRegCommentDots /> {post.comment}
            </span>
            <span className="flex items-center gap-2">
              <CiShare2 /> {post.shares}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

const Announcement = () => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Announcement</h2>
      </div>

      <div className="w-[400px] h-[280px] grid grid-cols-1 gap-6">
        {announcement.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition flex gap-4"
          >
            <img
              src={post.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500">{post.date}</p>
              <p className="text-gray-700 mt-2">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HazardReport;
