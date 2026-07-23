import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import GuestLayout from "@/layouts/GuestLayout";
import AppLayout from "@/layouts/AppLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import ChatsPage from "@/features/messages/pages/ChatsPage";
import GroupsPage from "@/features/groups/pages/GroupsPage";

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
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}