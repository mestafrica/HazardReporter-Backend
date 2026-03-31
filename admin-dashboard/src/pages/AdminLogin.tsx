import React from "react";
import hazardImage from "../assets/images/antoine-giret-7_TSzqJms4w-unsplash.jpg";

const AdminLogin: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 px-10 py-12 bg-white">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">
            Admin Panel
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to manage environmental hazard reports securely.
          </p>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="userName"
                type="text"
                name="userName"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Log In
            </button>
            <div className="text-right">
              <a
                href="/password-recovery"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </div>

        {/* Right Image / Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-green-50 items-center justify-center">
          <img
            src={hazardImage}
            alt="Environmental Illustration"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;