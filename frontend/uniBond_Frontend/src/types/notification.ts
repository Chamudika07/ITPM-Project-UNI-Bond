export type Notification = {
  id: string;
  type: "like" | "comment" | "friend_request" | "notice";
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // post id, etc.
};