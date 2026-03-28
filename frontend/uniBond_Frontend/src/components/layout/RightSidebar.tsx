import { useEffect, useState } from "react";
import FriendRequestList from "@/components/friend/FriendRequestList";
import OnlineContactsList from "@/components/friend/OnlineContactsList";
import DiscoverUsersList from "@/components/user/DiscoverUsersList";
import {
  handleGetFriendRequests,
  handleConfirmFriendRequest,
  handleDeleteFriendRequest,
  handleGetOnlineContacts,
} from "@/controllers/friendController";
import { handleGetDiscoverUsers } from "@/controllers/userController";
import type { FriendRequest, Friend } from "@/types/friend";
import type { DiscoverUser } from "@/types/user";

export default function RightSidebar() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [onlineContacts, setOnlineContacts] = useState<Friend[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<DiscoverUser[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [contactsError, setContactsError] = useState("");
  const [discoverError, setDiscoverError] = useState("");

  useEffect(() => {
    const loadFriendRequests = async () => {
      try {
        setRequestsLoading(true);
        setRequestsError("");
        const requests = await handleGetFriendRequests();
        setFriendRequests(requests);
      } catch (error) {
        console.error("Failed to load friend requests:", error);
        setFriendRequests([]);
        setRequestsError("Friend requests could not be loaded.");
      } finally {
        setRequestsLoading(false);
      }
    };

    const loadOnlineContacts = async () => {
      try {
        setContactsLoading(true);
        setContactsError("");
        const contacts = await handleGetOnlineContacts();
        setOnlineContacts(contacts);
      } catch (error) {
        console.error("Failed to load online contacts:", error);
        setOnlineContacts([]);
        setContactsError("Contacts could not be loaded.");
      } finally {
        setContactsLoading(false);
      }
    };

    const loadDiscoverUsers = async () => {
      try {
        setDiscoverLoading(true);
        setDiscoverError("");
        const users = await handleGetDiscoverUsers(5);
        setDiscoverUsers(users);
      } catch (error) {
        console.error("Failed to load discover users:", error);
        setDiscoverUsers([]);
        setDiscoverError("People suggestions are unavailable right now.");
      } finally {
        setDiscoverLoading(false);
      }
    };

    loadFriendRequests();
    loadOnlineContacts();
    loadDiscoverUsers();
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
        {requestsError && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {requestsError}
          </p>
        )}
        <FriendRequestList
          requests={friendRequests}
          onConfirm={handleConfirm}
          onDelete={handleDelete}
          loading={requestsLoading}
        />
      </div>

      {/* Online Contacts Card */}
      <div className="bg-gray-300 rounded-2xl p-5 shadow-sm border border-gray-400/40">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3">
          Contacts
        </h3>
        {contactsError && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {contactsError}
          </p>
        )}
        <OnlineContactsList contacts={onlineContacts} loading={contactsLoading} />
      </div>

      <div className="bg-gray-300 rounded-2xl p-5 shadow-sm border border-gray-400/40">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3">
          Discover Users
        </h3>
        <DiscoverUsersList
          users={discoverUsers}
          loading={discoverLoading}
          error={discoverError}
        />
      </div>
    </div>
  );
}
