import type { Notification } from "@/types/notification";

const getNotifications = (): Notification[] => {
  const stored = localStorage.getItem('mock_notifications');
  if (stored) return JSON.parse(stored);
  return []; 
};

const saveNotifications = (n: Notification[]) => {
  localStorage.setItem('mock_notifications', JSON.stringify(n));
};

export const mockGetNotifications = (userId?: string): Promise<Notification[]> => {
  let notifs = getNotifications();
  if (userId) {
    notifs = notifs.filter(n => !n.userId || n.userId === userId);
  }
  return Promise.resolve(notifs);
};

export const mockAddNotification = async (notification: Omit<Notification, "id" | "createdAt" | "isRead">): Promise<void> => {
  const allInfo = getNotifications();
  allInfo.unshift({
    ...notification,
    id: "not-" + Date.now().toString(),
    isRead: false,
    createdAt: new Date().toISOString()
  });
  saveNotifications(allInfo);
};

export const mockMarkAsRead = (notificationId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const notifs = getNotifications();
    const notif = notifs.find((n) => n.id === notificationId);
    if (!notif) return reject(new Error("Notification not found"));
    notif.isRead = true;
    saveNotifications(notifs);
    resolve();
  });
};