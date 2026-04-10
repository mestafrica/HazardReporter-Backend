import { createBrowserRouter, RouterProvider,} from "react-router-dom";
import DashboardLayout from "./layouts/dashBoardLayout";
import Dashboard from "./pages/Dashboard";
import ContentModeration from "./pages/ContentModeration";
import Announcements from "./pages/Announcements";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/AdminLogin";
import ErrorPage from "./errorpage";
import ProtectedRoute from "./components/ProtectedRoute";
import { DashboardProvider } from "./context/DashboardContext";
import { Toaster } from "react-hot-toast";



function App() {
    const router = createBrowserRouter([
      {
      path: "/admin-login",
      element: <AdminLogin />,
    },
       {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout/>
          </ProtectedRoute>
        ),
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
          path: "*",
          element: <ErrorPage />
      },
      {
        path: "/",
        element: <AdminLogin />
      }
    ]);

    return (
        <DashboardProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
        </DashboardProvider>
    );
};

export default App;