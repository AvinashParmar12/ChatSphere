// ==============================
// Imports
// ==============================

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useLogoutMutation } from "@/features/auth/api/auth.api";
import { setAuthenticated, setUser } from "@/features/auth/auth.slice";
import { removeToken } from "@/utils/token";
import { useNavigate } from "react-router-dom";
import { baseApi } from "@/api/baseApi";
import { clearSelectedConversation } from "@/features/conversations/conversation.slice";

// ==============================
// Component
// ==============================

const Topbar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      removeToken();
      dispatch(baseApi.util.resetApiState());
      dispatch(clearSelectedConversation());
      dispatch(setAuthenticated(false));
      dispatch(setUser(null));
      navigate("/login");
    }
  };

  const initials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "US";

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
      {/* Brand Logo / Mobile header */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          ChatSphere
        </span>
      </div>

      {/* User Actions & Profile */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="hidden text-sm font-medium text-gray-300 sm:block">
              {user.username}
            </span>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>
        )}

        {/* Logout Button Placeholder */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-red-950/30 hover:border-red-900 hover:text-red-400 transition-all duration-200"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
