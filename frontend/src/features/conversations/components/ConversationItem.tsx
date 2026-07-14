import clsx from "clsx";
import { type ConversationItemData } from "../types/conversation.types";

interface ConversationItemProps extends ConversationItemData {
  onClick?: () => void;
}

const ConversationItem = ({
  name,
  lastMessage,
  time,
  unreadCount,
  avatarUrl,
  isActive = false,
  onClick,
}: ConversationItemProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-slate-800/40 border-b border-slate-800/20 last:border-b-0",
        {
          "bg-slate-800/60 border-l-2 border-l-blue-500": isActive,
          "border-l-2 border-l-transparent": !isActive,
        }
      )}
    >
      {/* Avatar */}
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm tracking-wider">
            {name.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between">
          <h4 className="truncate font-medium text-slate-200">{name}</h4>
          <span
            className={clsx("shrink-0 text-xs", {
              "text-blue-400 font-medium": unreadCount && unreadCount > 0,
              "text-slate-500": !unreadCount,
            })}
          >
            {time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={clsx("truncate text-sm", {
              "text-slate-300 font-medium": unreadCount && unreadCount > 0,
              "text-slate-400": !unreadCount,
            })}
          >
            {lastMessage}
          </p>
          {unreadCount && unreadCount > 0 && (
            <div className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-blue-500/20">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
