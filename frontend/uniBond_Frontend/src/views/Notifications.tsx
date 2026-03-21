import { useEffect, useState } from "react";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import EmptyState from "@/components/common/EmptyState";
import { handleGetNotifications, handleMarkAsRead } from "@/controllers/notificationController";
import { formatDateTime } from "@/utils/formatters";
import type { Notification } from "@/types/notification";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const fetchedNotifications = await handleGetNotifications();
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return Heart;
      case "comment":
        return MessageCircle;
      case "friend_request":
        return UserPlus;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return "text-red-600";
      case "comment":
        return "text-blue-600";
      case "friend_request":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    try {
      await handleMarkAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  if (loading) {
    return (
      <SectionCard title="Notifications">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3 p-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  if (notifications.length === 0) {
    return (
      <SectionCard title="Notifications">
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Notifications">
      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                notification.isRead ? "bg-gray-50" : "bg-blue-50 border-l-4 border-blue-500"
              }`}
              onClick={() => !notification.isRead && handleMarkRead(notification.id)}
            >
              <Icon className={`w-5 h-5 mt-0.5 ${getNotificationColor(notification.type)}`} />
              <div className="flex-1">
                <p className={`text-sm ${notification.isRead ? "text-gray-700" : "text-gray-900 font-medium"}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateTime(notification.createdAt)}
                </p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}