import React, { FormEvent } from "react";
import RecoverImage from "./../assets/images/recovery.png";
import { Link } from "react-router-dom";

const PasswordRecovery: React.FC = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg">
          <div className="w-full md:w-1/2 p-8 space-y-6">
            <h1 className="text-3xl font-bold mb-12 text-blue-700">
              Password Recovery
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="Email"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your username or email"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-black bg-[#E6FCF9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Recovery Link
              </button>
              <div className="flex items-center justify-between">
                <Link
                  to="/login"
                  className="text-sm text-blue-700 hover:underline"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </div>
          <div className="hidden md:block md:w-1/2">
            <img
              src={RecoverImage}
              alt="Log"
              className="object-cover w-full h-full rounded-r-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordRecovery;
