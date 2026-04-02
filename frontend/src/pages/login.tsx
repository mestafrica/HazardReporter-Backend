import React, { useState } from "react";
import logImage from "../assets/images/log.png";
import { Link, useNavigate } from "react-router-dom";
import { apiLogin } from "../services/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggingIn, setLoggingIn] = useState<boolean>(false); // 👈 new state
  const { setLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoggingIn(true); // start loading

    try {
      const response = await apiLogin({ userName, password });

      if (response.status === 200 && response.data?.token) {
        const token = response.data.token;

        // Decode user from token
        const decoded = JSON.parse(atob(token.split(".")[1]));

        setLogin(token, decoded); // << use decoded instead of response.data.user

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1000,
        });

        // slight delay so toast shows before redirect
        setTimeout(() => navigate(`${ROUTES.dashboard}`), 1000);
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      toast.error("Please check your credentials.");
    } finally {
      setLoggingIn(false); // stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">
            Log in to <br />
            Ghana Hazard Reporter <br />
            Account
          </h1>
          <p className="text-sm leading-snug text-gray-700">
            By completing this survey you are consenting to storing and using
            your data to help us improve our services to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
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
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loggingIn}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm 
              text-base font-medium text-black bg-[#E6FCF9] 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
              ${loggingIn ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loggingIn ? "Logging in..." : "Log In"}
            </button>

            {/* Links */}
            <div className="flex items-center justify-between">
              <Link
                to="/password-recovery"
                className="text-sm text-blue-700 hover:underline"
              >
                Forgot your password?
              </Link>
              <Link
                to="/signup"
                className="text-sm text-blue-700 hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={logImage}
            alt="Log"
            className="object-cover w-full h-full rounded-r-lg"
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
