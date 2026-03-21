import type { Notification } from "@/types/notification";

const notifications: Notification[] = [
  {
    id: "not1",
    type: "like",
    message: "Chamudika liked your post",
    isRead: false,
    createdAt: new Date().toISOString(),
    relatedId: "1",
  },
  {
    id: "not2",
    type: "comment",
    message: "Dr. Nimal commented on your post",
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    relatedId: "2",
  },
];

export const mockGetNotifications = (): Promise<Notification[]> => {
  return Promise.resolve(notifications);
};

export const mockMarkAsRead = (notificationId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const notif = notifications.find((n) => n.id === notificationId);
    if (!notif) return reject(new Error("Notification not found"));
    notif.isRead = true;
    resolve();
  });
};