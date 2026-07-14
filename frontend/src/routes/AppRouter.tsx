import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import GuestLayout from "@/layouts/GuestLayout";
import AppLayout from "@/layouts/AppLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Navigate to="/login" replace />,
  },

  {
    element: <GuestLayout />,

    children: [
      {
        path: "/login",

        element: <LoginPage />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/dashboard",

        element: <DashboardPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}