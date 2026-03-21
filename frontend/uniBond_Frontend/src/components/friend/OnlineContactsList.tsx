import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import { Check } from "lucide-react";
import type { Friend } from "@/types/friend";

type Props = {
  contacts: Friend[];
  loading?: boolean;
};

export default function OnlineContactsList({ contacts, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <EmptyState
        icon={Check}
        title="No online contacts"
        description="Your friends are currently offline"
      />
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div key={contact.id} className="flex items-center gap-3">
          <div className="relative">
            <Avatar src={contact.avatar} alt={contact.name} size="sm" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-medium text-gray-900">{contact.name}</p>
            <p className="text-sm text-gray-500 capitalize">{contact.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}