import { useEffect, useState } from "react";
import { handleGetNotifications, handleMarkAsRead } from "@/controllers/notificationController";
import type { Notification } from "@/types/notification";
import SectionCard from "@/components/common/SectionCard";
import EmptyState from "@/components/common/EmptyState";
import { Bell, Heart, MessageSquare, GraduationCap, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuthHook";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const data = await handleGetNotifications(user.id);
    setNotifications(data);
    setLoading(false);
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like": return <Heart className="w-5 h-5 text-red-500 fill-red-50" />;
      case "comment": return <MessageSquare className="w-5 h-5 text-blue-500 fill-blue-50" />;
      case "kuppy": return <GraduationCap className="w-5 h-5 text-indigo-500 fill-indigo-50" />;
      case "group": return <Users className="w-5 h-5 text-green-500 fill-green-50" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const onMarkAsRead = async (id: string) => {
    await handleMarkAsRead(id);
    fetchNotifications();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <div className="flex justify-between items-center mb-6 px-2">
         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600 fill-blue-100"/> Notifications
         </h1>
       </div>

      {loading ? (
        <div className="text-center py-10">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <SectionCard title="Notifications">
           <EmptyState icon={Bell} title="All caught up!" description="You don't have any new notifications." />
        </SectionCard>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
           {notifications.map((n, idx) => (
              <div 
                 key={n.id} 
                 className={`flex items-start gap-4 p-5 transition ${idx !== notifications.length - 1 ? 'border-b border-gray-100' : ''} ${!n.isRead ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'}`}
                 onClick={() => !n.isRead && onMarkAsRead(n.id)}
              >
                  <div className="shrink-0 mt-1">
                     {getIcon(n.type)}
                  </div>
                  <div className="flex-1 cursor-pointer">
                     <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                       {n.message}
                     </p>
                     <p className="text-xs text-gray-400 mt-1 font-medium">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                  {!n.isRead && (
                     <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2 shrink-0"></div>
                  )}
              </div>
           ))}
        </div>
      )}
    </div>
  );
}