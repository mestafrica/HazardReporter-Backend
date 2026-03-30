import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import padlock from "../assets/images/forms/padlock.jpg";
import { apiAdminLogin } from "../services/auth";
import axios from "axios";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  // State to handle field errors
  const [errors, setErrors] = useState<{ userName?: string; password?: string; apiError?: string }>({});

  const saveLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Reset errors

    const formData = new FormData(e.currentTarget);
    const userName = (formData.get("userName") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    let hasError = false;
    const newErrors: { userName?: string; password?: string } = {};

    if (!userName) {
      newErrors.userName = "Username is required";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await apiAdminLogin({ userName, password });
      navigate("/admin-dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors({ apiError: error.response?.data || "Login failed. Please try again." });
      } else {
        setErrors({ apiError: "Unexpected error occurred. Please try again." });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg">
        {/* Login form */}
        <div className="w-full md:w-1/2 px-12 py-12 space-y-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">Admin Panel Login</h1>

          {errors.apiError && (
            <div className="text-red-600 text-center mb-4">{errors.apiError}</div>
          )}

          <form onSubmit={saveLogin} className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="userName"
                type="text"
                name="userName"
                placeholder="Enter your username"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  errors.userName ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In
            </button>

            <div className="text-center">
              <Link to="/password-recovery" className="text-sm text-blue-700 hover:underline">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>

        {/* Side image */}
        <div className="hidden md:block md:w-1/2">
          <img src={padlock} alt="Lock" className="object-cover w-full h-full rounded-r-lg" />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;