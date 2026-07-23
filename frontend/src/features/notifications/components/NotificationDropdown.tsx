import NotificationItem from "./NotificationItem";
import EmptyNotifications from "./EmptyNotifications";
import type { BackendNotification } from "../types/notification.types";

interface NotificationDropdownProps {
  notifications: BackendNotification[];
  isLoading: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  isMarkingAllRead: boolean;
}

const NotificationDropdown = ({
  notifications,
  isLoading,
  onClose,
  onMarkAllAsRead,
  isMarkingAllRead,
}: NotificationDropdownProps) => {
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="absolute right-0 top-full mt-2 w-80 origin-top-right overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900 shadow-xl ring-1 ring-black/5 focus:outline-none z-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/50 px-4 py-3">
        <h3 className="font-semibold text-slate-200">Notifications</h3>
        {hasUnread && (
          <button
            onClick={onMarkAllAsRead}
            disabled={isMarkingAllRead}
            className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 disabled:opacity-50"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="custom-scrollbar max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-500 border-t-blue-500" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClose={onClose}
            />
          ))
        ) : (
          <EmptyNotifications />
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
