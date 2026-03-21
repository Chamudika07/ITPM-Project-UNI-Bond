import { getNotifications, markAsRead } from "@/models/notificationModel";
import type { Notification } from "@/types/notification";

export const handleGetNotifications = async (): Promise<Notification[]> => {
  return await getNotifications();
};

export const handleMarkAsRead = async (notificationId: string): Promise<void> => {
  return await markAsRead(notificationId);
};