import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import GuestLayout from "@/layouts/GuestLayout";
import AppLayout from "@/layouts/AppLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ChatsPage from "@/features/messages/pages/ChatsPage";
import GroupsPage from "@/features/groups/pages/GroupsPage";
import ProfilePage from "@/features/users/pages/ProfilePage";
import SettingsPage from "@/features/users/pages/SettingsPage";

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
      {
        path: "/register",

        element: <RegisterPage />,
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
        element: <Navigate to="/chats" replace />,
      },
      {
        path: "/chats",
        element: <ChatsPage />,
      },
      {
        path: "/groups",
        element: <GroupsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}