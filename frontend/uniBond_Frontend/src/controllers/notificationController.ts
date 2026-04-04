import { getNotifications, markAsRead } from "@/models/notificationModel";
import type { Notification } from "@/types/notification";

export const handleGetNotifications = async (userId?: string): Promise<Notification[]> => {
  return await getNotifications(userId);
};

export const handleMarkAsRead = async (notificationId: string): Promise<void> => {
  return await markAsRead(notificationId);
};