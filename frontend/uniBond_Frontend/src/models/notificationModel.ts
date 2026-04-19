import apiClient from "@/services/api/axiosClient";
import type { Notification, NotificationSummary } from "@/types/notification";
import { mockGetNotifications, mockGetNotificationSummary, mockMarkAllAsRead, mockMarkAsRead } from "@/services/mock/mockNotificationApi";

const mapNotificationResponse = (n: any): Notification => ({
  id: String(n.id),
  userId: String(n.user_id),
  message: n.message || "",
  type: (n.type || "notice") as Notification["type"],
  isRead: Boolean(n.is_read),
  createdAt: n.created_at,
  relatedId: n.related_id ? String(n.related_id) : undefined,
});

const mapNotificationSummaryResponse = (data: any): NotificationSummary => ({
  totalCount: Number(data.total_count || 0),
  unreadCount: Number(data.unread_count || 0),
});

export const getNotifications = async (options?: { unreadOnly?: boolean }): Promise<Notification[]> => {
  try {
    const res = await apiClient.get("/notifications", {
      params: { unread_only: options?.unreadOnly || undefined },
    });
    return res.data.map(mapNotificationResponse);
  } catch (error) {
    console.warn("Falling back to mock notifications.", error);
    return mockGetNotifications(options);
  }
};

export const getNotificationSummary = async (): Promise<NotificationSummary> => {
  try {
    const res = await apiClient.get("/notifications/summary");
    return mapNotificationSummaryResponse(res.data);
  } catch (error) {
    console.warn("Falling back to mock notification summary.", error);
    return mockGetNotificationSummary();
  }
};

export const markAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const res = await apiClient.put(`/notifications/${notificationId}/read`);
    return mapNotificationResponse(res.data);
  } catch (error) {
    console.warn(`Falling back to mock markAsRead for notification ${notificationId}.`, error);
    return mockMarkAsRead(notificationId);
  }
};

export const markAllAsRead = async (): Promise<NotificationSummary> => {
  try {
    const res = await apiClient.put("/notifications/read-all");
    return mapNotificationSummaryResponse(res.data);
  } catch (error) {
    console.warn("Falling back to mock markAllAsRead.", error);
    return mockMarkAllAsRead();
  }
};
