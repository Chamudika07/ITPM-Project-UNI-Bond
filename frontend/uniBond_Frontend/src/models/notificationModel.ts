import { mockGetNotifications, mockMarkAsRead } from "@/utils/mockNotificationApi";
import type { Notification } from "@/types/notification";

export const getNotifications = async (): Promise<Notification[]> => {
  return await mockGetNotifications();
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  return await mockMarkAsRead(notificationId);
};