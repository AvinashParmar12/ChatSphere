// ==============================
// Imports
// ==============================

import { useAppSelector } from "@/store/hooks";

// ==============================
// Component
// ==============================

const UserProfileCard = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return null;
  }

  const initials = user.username
    ? user.username.substring(0, 2).toUpperCase()
    : "US";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-slate-800 p-3 shadow-md hover:bg-slate-800/40 transition-all duration-200">
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-semibold text-white shadow-inner">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold text-gray-100">
          {user.username}
        </h4>

        <p className="truncate text-xs text-gray-400">
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserProfileCard;
