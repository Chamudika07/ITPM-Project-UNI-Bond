import { useEffect, useState } from "react";
import SectionCard from "@/components/common/SectionCard";
import FriendRequestList from "@/components/friend/FriendRequestList";
import OnlineContactsList from "@/components/friend/OnlineContactsList";
import { handleGetFriendRequests, handleConfirmFriendRequest, handleDeleteFriendRequest, handleGetOnlineContacts } from "@/controllers/friendController";
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
    </div>
  );
}