import type { User } from "@/features/auth/types/auth.types";

interface UserSearchItemProps {
  user: User;
  onClick: (user: User) => void;
}

const UserSearchItem = ({ user, onClick }: UserSearchItemProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(user)}
      className="flex w-full items-center gap-3 p-3 text-left hover:bg-slate-800/50 transition-colors rounded-xl"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white overflow-hidden">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm tracking-wider uppercase">
            {user.username.substring(0, 2)}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <span className="truncate font-medium text-slate-200">
          {user.username}
        </span>
        <span className="truncate text-xs text-slate-500">
          {user.email}
        </span>
      </div>
    </button>
  );
};

export default UserSearchItem;
