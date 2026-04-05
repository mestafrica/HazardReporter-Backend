import React from "react";
import { useNavigate } from "react-router-dom";
import padlock from "../assets/images/forms/padlock.jpg";
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
              disabled={isLoading}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

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
