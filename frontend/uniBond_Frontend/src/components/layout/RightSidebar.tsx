import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import OnlineContactsList from "@/components/friend/OnlineContactsList";
import DiscoverUsersList from "@/components/user/DiscoverUsersList";
import { handleGetDiscoverUsers, handleGetOnlineUsers } from "@/controllers/userController";
import type { DiscoverUser, OnlineContact } from "@/types/user";

const DISCOVER_LIMIT = 6;
const ONLINE_LIMIT = 8;

export default function RightSidebar() {
  const location = useLocation();
  const [onlineContacts, setOnlineContacts] = useState<OnlineContact[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<DiscoverUser[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [contactsError, setContactsError] = useState("");
  const [discoverError, setDiscoverError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const viewedProfileId = location.pathname.startsWith("/profile/")
      ? location.pathname.split("/")[2]
      : undefined;

    const loadSidebarData = async () => {
      try {
        setContactsLoading(true);
        setDiscoverLoading(true);
        setContactsError("");
        setDiscoverError("");

        const [contacts, users] = await Promise.all([
          handleGetOnlineUsers(ONLINE_LIMIT),
          handleGetDiscoverUsers(DISCOVER_LIMIT, undefined, {
            excludeFollowed: true,
            excludeUserId: viewedProfileId,
          }),
        ]);

        if (cancelled) return;

        setOnlineContacts(contacts);
        setDiscoverUsers(users.filter((user) => !user.isFollowing));
      } catch (error) {
        console.error("Failed to load right sidebar data:", error);
        if (cancelled) return;
        setOnlineContacts([]);
        setDiscoverUsers([]);
        setContactsError("Online contacts could not be loaded.");
        setDiscoverError("People suggestions are unavailable right now.");
      } finally {
        if (!cancelled) {
          setContactsLoading(false);
          setDiscoverLoading(false);
        }
      }
    };

    void loadSidebarData();
    const intervalId = window.setInterval(() => {
      void loadSidebarData();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [location.pathname]);

  return (
    <div className="space-y-3 sticky top-[80px] max-h-[calc(100vh-80px)] overflow-y-auto pb-4">
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
