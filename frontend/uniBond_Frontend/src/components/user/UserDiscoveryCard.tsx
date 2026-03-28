import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/common/Avatar";
import type { DiscoverUser } from "@/types/user";

type Props = {
  user: DiscoverUser;
};

export default function UserDiscoveryCard({ user }: Props) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(user.profilePath)}
      className="w-full rounded-xl border border-gray-200 bg-white/80 px-3 py-3 text-left shadow-sm transition hover:border-gray-300 hover:bg-white"
    >
      <div className="flex items-start gap-3">
        <Avatar src={user.avatar} alt={user.fullName} size="sm" className="ring-1 ring-gray-200" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{user.fullName}</p>
          <p className="text-xs capitalize text-gray-500">{user.role.replace("_", " ")}</p>
          {user.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.location}</span>
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
