import React from "react";
import { Link, useNavigate } from "react-router-dom";
import padlock from "../assets/images/forms/padlock.jpg";
import { apiAdminLogin } from "../services/auth";
import axios from "axios"; // importing axios for error checking

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const saveLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const userName = formData.get("userName") as string | null;
      const password = formData.get("password") as string | null;

      // Ensuring email and password are present
      if (!userName || !password) {
        alert(`Email and password are required.`);
        return;
      }

      await apiAdminLogin({ userName, password });

      // Navigate only after successful login
      navigate("/admin-dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(`API error: ${error.response?.data}`);
      } else {
        alert(`Unexpected error: ${error}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg">
        <div className="w-full md:w-1/2 px-12 py-12 space-y-8">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">
            Login to <br />
            The Admin Panel
            <br />
          </h1>

          <form onSubmit={saveLogin} className="space-y-6">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            <h1 className="text-sm text-gray-500">
              By completing this survey you are consenting to storing and using
              your data to help us improve our services to you.
            </h1>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In
            </button>
            <div className="flex items-center justify-between">
              <Link
                to="/password-recovery"
                className="text-sm text-blue-700 hover:underline"
              >
                Forgot your password?
              </Link>
              <Link
                to="/admin-signup"
                className="text-sm text-blue-700 hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
        <div className="hidden md:block md:w-1/2">
          <img
            src={padlock}
            alt="Lock"
            className="object-cover w-full h-full rounded-r-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
