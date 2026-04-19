import type { ProfileConnectionStats, User, UserSummary } from "@/types/user";
import SectionCard from "@/components/common/SectionCard";
import { Mail, GraduationCap, MapPin, Home, Briefcase } from "lucide-react";
import ProfileConnectionsCard from "./ProfileConnectionsCard";

type Props = {
  user: User;
  stats: ProfileConnectionStats;
  connections: UserSummary[];
  connectionsLoading?: boolean;
  connectionsError?: string;
  isOwnProfile: boolean;
};

export default function ProfileLeftColumn({
  user,
  stats,
  connections,
  connectionsLoading = false,
  connectionsError = "",
  isOwnProfile,
}: Props) {
  const currentLocation = [user.city, user.country].filter(Boolean).join(", ") || "Location not shared";

  return (
    <div className="space-y-4">
      <SectionCard title="Intro">
        <div className="space-y-4 text-sm text-gray-700 p-2">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400 shrink-0" />
            <span className="break-all">{user.email}</span>
          </div>
          
          {"education" in user && (
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400 shrink-0" />
              <span>Studied <strong>{user.education}</strong></span>
            </div>
          )}
          
          {"industry" in user && (
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />
              <span>Industry: <strong>{user.industry}</strong></span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-gray-400 shrink-0" />
            <span>Lives in <strong>{currentLocation}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
            <span>From <strong>{currentLocation}</strong></span>
          </div>
        </div>
      </SectionCard>

      <ProfileConnectionsCard
        connections={connections}
        totalConnections={stats.connections}
        loading={connectionsLoading}
        error={connectionsError}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
}
