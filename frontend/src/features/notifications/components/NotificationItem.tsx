import { useAppDispatch } from "@/store/hooks";
import { useMarkAsReadMutation } from "../api/notification.api";
import { useGetConversationsQuery } from "@/features/conversations/api/conversation.api";
import { setSelectedConversation } from "@/features/conversations/conversation.slice";
import type { BackendNotification } from "../types/notification.types";

interface NotificationItemProps {
  notification: BackendNotification;
  onClose: () => void;
}

const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
  const [markAsRead, { isLoading }] = useMarkAsReadMutation();
  const dispatch = useAppDispatch();
  const { data: conversationsResponse } = useGetConversationsQuery();

  const handleOpen = async () => {
    if (!notification.isRead && !isLoading) {
      try {
        await markAsRead(notification._id).unwrap();
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }

    if (notification.relatedId && conversationsResponse?.data) {
      const conversation = conversationsResponse.data.find(
        (c) => c._id === notification.relatedId
      );
      if (conversation) {
        dispatch(setSelectedConversation(conversation));
      }
    }

    onClose();
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const senderName = notification.sender?.username || "System";
  const avatarUrl = notification.sender?.avatar;

  return (
    <div
      onClick={handleOpen}
      className={`flex cursor-pointer gap-3 border-b border-slate-700/50 p-4 transition-colors hover:bg-slate-700/30 ${
        !notification.isRead ? "bg-slate-800/40" : ""
      }`}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 font-bold text-white">
        {avatarUrl ? (
          <img src={avatarUrl} alt={senderName} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs tracking-wider">
            {senderName.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <h4 className="truncate text-sm font-semibold text-slate-200">
            {senderName}
          </h4>
          <span className="shrink-0 text-xs text-slate-500">
            {getRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p
          className={`mt-0.5 truncate text-sm ${
            !notification.isRead ? "font-medium text-slate-300" : "text-slate-400"
          }`}
        >
          {notification.content}
        </p>
      </div>
      {!notification.isRead && (
        <div className="flex shrink-0 items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
