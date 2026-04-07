import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/dashBoardLayout";
import Dashboard from "./pages/Dashboard";
import ContentModeration from "./pages/ContentModeration";
import Announcements from "./pages/Announcements";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/AdminLogin";

function App() {
    const router = createBrowserRouter([
      {
      path: "/admin-login",
      element: <AdminLogin />,
    },
       {
        path: "/admin-dashboard",
        element: <DashboardLayout/>,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "moderation",
                element: <ContentModeration />,
            },
            {
                path: "announcements",
                element: <Announcements />,
            },
            {
                path: "users",
                element: <UserManagement />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
      },
      {
          // Redirect root to dashboard for convenience
          path: "/",
          element: <Navigate to="/admin-dashboard" replace />
      }
    ]);
export default App;