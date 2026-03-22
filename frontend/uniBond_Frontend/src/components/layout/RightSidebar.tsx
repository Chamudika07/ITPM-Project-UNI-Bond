import { useEffect, useState } from "react";
import FriendRequestList from "@/components/friend/FriendRequestList";
import OnlineContactsList from "@/components/friend/OnlineContactsList";
import {
  handleGetFriendRequests,
  handleConfirmFriendRequest,
  handleDeleteFriendRequest,
  handleGetOnlineContacts,
} from "@/controllers/friendController";
import type { FriendRequest, Friend } from "@/types/friend";

export default function RightSidebar() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [onlineContacts, setOnlineContacts] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [requests, contacts] = await Promise.all([
          handleGetFriendRequests(),
          handleGetOnlineContacts(),
        ]);
        setFriendRequests(requests);
        setOnlineContacts(contacts);
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
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Failed to confirm request:", error);
    }
  };

  const handleDelete = async (requestId: string) => {
    try {
      await handleDeleteFriendRequest(requestId);
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  return (
    <div className="space-y-3 sticky top-[80px] max-h-[calc(100vh-80px)] overflow-y-auto pb-4">
      {/* Friend Requests Card */}
      <div className="bg-gray-300 rounded-2xl p-5 shadow-sm border border-gray-400/40">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3">
          Friend Requests
        </h3>
        <FriendRequestList
          requests={friendRequests}
          onConfirm={handleConfirm}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {/* Online Contacts Card */}
      <div className="bg-gray-300 rounded-2xl p-5 shadow-sm border border-gray-400/40">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3">
          Contacts
        </h3>
        <OnlineContactsList contacts={onlineContacts} loading={loading} />
      </div>
    </div>
  );
}