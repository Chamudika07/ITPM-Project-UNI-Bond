import apiClient from "@/services/api/axiosClient";
import type { Notification } from "@/types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await apiClient.get("/notices/notifications/");
  return res.data.map((n: any) => ({
    id: String(n.id),
    userId: String(n.user_id),
    message: n.content,
    type: "system", // default or mapped from something else
    isRead: n.is_read,
    timestamp: n.created_at
  }));
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  await apiClient.post(`/notices/notifications/${notificationId}/read`);
};