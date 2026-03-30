import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminDashboardLayout from "./pages/AdminDashboardLayout";
import AdminDashboardHome from "./pages/AdminDashboardHome";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const router = createBrowserRouter([
    {
      path: "/admin-login",
      element: <AdminLogin />,
    },
    {
      path: "/admin-dashboard",
      element: <AdminDashboardLayout />,
      children: [
        {
          index: true,
          element: <AdminDashboardHome />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;