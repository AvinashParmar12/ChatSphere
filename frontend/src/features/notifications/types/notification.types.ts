export interface BackendNotification {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    username: string;
    avatar?: string;
  };
  type: string; // e.g. "new_message", "group_invite"
  content: string;
  relatedId?: string; // conversationId, groupId, etc.
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  message?: string;
  data: BackendNotification[];
}
