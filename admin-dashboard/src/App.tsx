import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardLayout from "./layouts/dashBoardLayout";
import Home from "./components/Home";
import Events from "./components/Events";
import Inbox from "./components/Inbox";
import Broadcasts from "./components/Broadcasts";
import Settings from "./components/Settings";
import Sidebar from "./components/SideBar";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const router = createBrowserRouter([
    {
      path: "/admin-login", // <-- add this route
      element: <AdminLogin />,
    },
    {
      path: "/sidebar",
      element: <Sidebar />,
    },
    {
      path: "/admin-dashboard",
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "events", element: <Events /> }, // simplified paths
        { path: "inbox", element: <Inbox /> },
        { path: "broadcasts", element: <Broadcasts /> },
        { path: "settings", element: <Settings /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;