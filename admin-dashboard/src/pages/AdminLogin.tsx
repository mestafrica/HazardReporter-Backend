import React from "react";
import hazardImage from "../assets/images/antoine-giret-7_TSzqJms4w-unsplash.jpg";
import { useNavigate } from "react-router-dom";
import { apiAdminLogin } from "../services/auth";
import { useDashboard } from "../context/DashboardContext";
import toast from "react-hot-toast";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { refreshData } = useDashboard();
  const [isLoading, setIsLoading] = React.useState(false);

  const saveLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const userName = formData.get("userName") as string | null;
      const password = formData.get("password") as string | null;

      const response = await apiAdminLogin({ userName, password });

      if (response.status === 200) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        if (response.data.admin) {
          localStorage.setItem("adminProfile", JSON.stringify(response.data.admin));
        }

        toast.success("Login successful!");
        await refreshData();
        navigate("/admin-dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 md:p-0">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="w-full md:w-1/2 px-6 md:px-12 py-10 md:py-16 space-y-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">
            Admin Panel
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to manage environmental hazard reports securely.
          </p>

          <form onSubmit={saveLogin} className="space-y-6">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="userName"
                type="text"
                name="userName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Log In"}
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