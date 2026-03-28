import { useEffect, useState } from "react";
import SectionCard from "@/components/common/SectionCard";
import FriendRequestList from "@/components/friend/FriendRequestList";
import OnlineContactsList from "@/components/friend/OnlineContactsList";
import { handleGetFriendRequests, handleConfirmFriendRequest, handleDeleteFriendRequest, handleGetOnlineContacts } from "@/controllers/friendController";
import { handleGetTasks } from "@/controllers/taskController";
import type { FriendRequest, Friend } from "@/types/friend";
import type { Task } from "@/types/task";
import { useNavigate } from "react-router-dom";
import { Star, Users } from "lucide-react";

export default function RightSidebar() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [onlineContacts, setOnlineContacts] = useState<Friend[]>([]);
  const [topTasks, setTopTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [requests, contacts, tasks] = await Promise.all([
          handleGetFriendRequests(),
          handleGetOnlineContacts(),
          handleGetTasks()
        ]);
        setFriendRequests(requests);
        setOnlineContacts(contacts);
        
        // Sort tasks by popularity (applicants) and get top 10
        const sorted = tasks.sort((a,b) => b.applicants.length - a.applicants.length).slice(0, 10);
        setTopTasks(sorted);
      } catch (error) {
        console.error("Failed to load sidebar data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleConfirm = async (requestId: string) => {
    try {
      await handleConfirmFriendRequest(requestId);
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Failed to confirm request:", error);
    }
  };

  const handleDelete = async (requestId: string) => {
    try {
      await handleDeleteFriendRequest(requestId);
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Friend Requests */}
      <SectionCard title="Friend Requests">
        <FriendRequestList
          requests={friendRequests}
          onConfirm={handleConfirm}
          onDelete={handleDelete}
          loading={loading}
        />
      </SectionCard>

      {/* Online Contacts */}
      <SectionCard title="Contacts">
        <OnlineContactsList contacts={onlineContacts} loading={loading} />
      </SectionCard>
      
      {/* Top 10 Opportunities */}
      <SectionCard title="🔥 Top 10 Opportunities">
        {loading ? (
          <div className="animate-pulse space-y-3 p-2">
            {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-200 rounded-lg w-full"></div>)}
          </div>
        ) : (
          <div className="space-y-3">
             {topTasks.map((t, i) => (
                <div key={t.id} onClick={() => navigate(`/tasks/${t.id}`)} className="bg-white p-3 border border-gray-400/40 rounded-xl hover:bg-gray-50 cursor-pointer transition">
                  <div className="flex gap-2 items-start">
                     <div className="font-black text-gray-400 w-5 block shrink-0">{i+1}</div>
                     <div className="flex-1">
                       <h5 className="text-black font-bold text-sm line-clamp-1">{t.title}</h5>
                       <div className="flex justify-between items-center mt-1">
                         <span className="text-xs text-gray-600 font-medium">{t.companyName}</span>
                         <span className="text-xs text-black bg-gray-100 flex items-center gap-1 font-bold px-1.5 py-0.5 rounded border border-gray-200"><Users className="w-3 h-3"/> {t.applicants.length}</span>
                       </div>
                     </div>
                  </div>
                </div>
             ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}