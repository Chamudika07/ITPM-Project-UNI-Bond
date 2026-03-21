import { Check, X } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import type { FriendRequest } from "@/types/friend";

type Props = {
  requests: FriendRequest[];
  onConfirm: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  loading?: boolean;
};

export default function FriendRequestList({ requests, onConfirm, onDelete, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={Check}
        title="No pending requests"
        description="You're all caught up!"
      />
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={request.fromUserAvatar} alt={request.fromUserName} size="sm" />
            <div>
              <p className="font-medium text-gray-900">{request.fromUserName}</p>
              <p className="text-sm text-gray-500 capitalize">{request.fromUserRole}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onConfirm(request.id)}
              className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(request.id)}
              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}